<?php

declare(strict_types=1);

namespace App\Serializer;

use ApiPlatform\Metadata\IriConverterInterface;
use Sylius\Bundle\ApiBundle\SectionResolver\ShopApiSection;
use Sylius\Bundle\ApiBundle\Serializer\SerializationGroupsSupportTrait;
use Sylius\Bundle\CoreBundle\SectionResolver\SectionProviderInterface;
use Sylius\Component\Core\Model\ProductInterface;
use Sylius\Component\Product\Model\ProductVariantInterface;
use Sylius\Component\Core\Calculator\ProductVariantPricesCalculatorInterface;
use Sylius\Component\Product\Resolver\ProductVariantResolverInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Webmozart\Assert\Assert;
use Sylius\Component\Core\Model\ChannelInterface;
use Sylius\Bundle\ApiBundle\Serializer\ContextKeys;
use Sylius\Component\Core\Exception\MissingChannelConfigurationException;

final class ProductNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;
    use SerializationGroupsSupportTrait;

    private const ALREADY_CALLED = 'product_normalizer_already_called';

    public function __construct(
        private readonly ProductVariantPricesCalculatorInterface $priceCalculator,
        private readonly ProductVariantResolverInterface $defaultProductVariantResolver,
        private readonly IriConverterInterface $iriConverter,
        private readonly SectionProviderInterface $sectionProvider,
        private readonly array $serializationGroups,
    ) {
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        Assert::isInstanceOf($object, ProductInterface::class);
        Assert::keyNotExists($context, self::ALREADY_CALLED);
        Assert::isInstanceOf($this->sectionProvider->getSection(), ShopApiSection::class);
        Assert::true($this->supportsSerializationGroups($context, $this->serializationGroups));

        $context[self::ALREADY_CALLED] = true;

        $data = $this->normalizer->normalize($object, $format, $context);

        $variants = $object->getEnabledVariants();
        $defaultVariant = $this->defaultProductVariantResolver->getVariant($object);
        $channel = $context[ContextKeys::CHANNEL] ?? null;


        // Récupération des variantes avec gestion d'erreurs sur les champs à risque
        $data['variants'] = $variants
            ->map(function (ProductVariantInterface $variant) use ($channel, $defaultVariant) {
                $price = null;
                $originalPrice = null;
                $lowestPriceBeforeDiscount = null;

                $options = [];
                foreach ($variant->getOptionValues() as $optionValue) {
                    $options[] = [
                        'code' => $optionValue->getOption()->getCode(),
                        'name' => $optionValue->getOption()->getName(),
                        'value' => $optionValue->getValue(),
                    ];
                }

                try {
                    $price = $this->priceCalculator->calculate($variant, ['channel' => $channel]);
                } catch (\Exception $e) {
                    // Log l'erreur si nécessaire
                    $price = null;
                }

                try {
                    $originalPrice = $this->priceCalculator->calculateOriginal($variant, ['channel' => $channel]);
                } catch (\Exception $e) {
                    $originalPrice = null;
                }

                try {
                    $lowestPriceBeforeDiscount = $this->priceCalculator->calculateLowestPriceBeforeDiscount($variant, ['channel' => $channel]);
                } catch (\Exception $e) {
                    $lowestPriceBeforeDiscount = null;
                }

                return [
                    '@id' => $this->iriConverter->getIriFromResource($variant),
                    'id' => $variant->getId(),
                    'position' => $variant->getPosition(),
                    'enabled' => $variant->isEnabled(),
                    'code' => $variant->getCode(),
                    'name' => $variant->getName(),
                    'inStock' => $variant->isTracked() ? $variant->getOnHand() > 0 : true,
                    'weight' => $variant->getWeight(),
                    'width' => $variant->getWidth(),
                    'height' => $variant->getHeight(),
                    'depth' => $variant->getDepth(),
                    'price' => $price,
                    'options' => $options,
                    'originalPrice' => $originalPrice,
                    'lowestPriceBeforeDiscount' => $lowestPriceBeforeDiscount,
                    'isDefault' => $defaultVariant && $defaultVariant->getId() === $variant->getId(), // Flag default variant
                ];
            })
            ->getValues();

        // Default variant
        $data['defaultVariant'] = $defaultVariant ? $this->iriConverter->getIriFromResource($defaultVariant) : null;

        // Récupération de la devise
        $currency = $channel instanceof ChannelInterface ? $channel->getBaseCurrency() : null;
        if ($currency !== null) {
            $data['currencySymbol'] = $currency->getCode();
        }

        // Main Taxon
        $mainTaxon = $object->getMainTaxon();
        $data['mainTaxon'] = $mainTaxon ? [
            '@id' => $this->iriConverter->getIriFromResource($mainTaxon),
            'id' => $mainTaxon->getId(),
            'code' => $mainTaxon->getCode(),
            'name' => $mainTaxon->getName(),
        ] : null;

        return $data;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return
            !isset($context[self::ALREADY_CALLED]) &&
            $data instanceof ProductInterface &&
            $this->sectionProvider->getSection() instanceof ShopApiSection &&
            $this->supportsSerializationGroups($context, $this->serializationGroups);
    }

    public function getSupportedTypes(?string $format): array
    {
        return [ProductInterface::class => false];
    }
}
