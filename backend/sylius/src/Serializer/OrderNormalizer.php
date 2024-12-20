<?php

declare(strict_types=1);

namespace App\Serializer;

use ApiPlatform\Metadata\IriConverterInterface;
use Sylius\Bundle\ApiBundle\SectionResolver\ShopApiSection;
use Sylius\Bundle\ApiBundle\Serializer\SerializationGroupsSupportTrait;
use Sylius\Bundle\CoreBundle\SectionResolver\SectionProviderInterface;
use Sylius\Component\Core\Model\OrderInterface;
use Sylius\Component\Core\Model\OrderItemInterface;
use Sylius\Component\Core\Model\ProductVariantInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Webmozart\Assert\Assert;
use Doctrine\ORM\PersistentCollection;
use App\Entity\Product\ProductImage;
use Liip\ImagineBundle\Service\FilterService;

final class OrderNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;
    use SerializationGroupsSupportTrait;

    private const ALREADY_CALLED = 'order_normalizer_already_called';

    public function __construct(
        private readonly IriConverterInterface $iriConverter,
        private readonly SectionProviderInterface $sectionProvider,
        private readonly FilterService $filterService,
        private readonly array $serializationGroups,
    ) {
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        Assert::isInstanceOf($object, OrderInterface::class);
        Assert::keyNotExists($context, self::ALREADY_CALLED);
        Assert::isInstanceOf($this->sectionProvider->getSection(), ShopApiSection::class);
        Assert::true($this->supportsSerializationGroups($context, $this->serializationGroups));

        $context[self::ALREADY_CALLED] = true;

        $data = $this->normalizer->normalize($object, $format, $context);

        if (isset($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as &$item) {
                // Vérifier que la clé 'variant' existe
                if (isset($item['variant']) && is_string($item['variant'])) {
                    // Récupérer le variant via l'IRI
                    $variant = $this->iriConverter->getResourceFromIri($item['variant']);
                    if ($variant instanceof ProductVariantInterface) {
                        $product = $variant->getProduct();
                        $images = $product->getImages();
                        if ($images instanceof PersistentCollection) {
                            $images->initialize();
                        }

                        $images = $images->map(function ($image) {
                            if ($image instanceof ProductImage) {
                                $publicUrl = $this->filterService->getUrlOfFilteredImage($image->getPath(), 'sylius_small'); // Utilisez un filtre approprié

                                return [
                                    '@id' => $this->iriConverter->getIriFromResource($image),
                                    '@type' => 'ProductImage',
                                    'id' => $image->getId(),
                                    'type' => $image->getType(),
                                    'path' => $publicUrl, // Utilisez l'URL publique
                                ];
                            }

                            return null;
                        })->toArray();

                        // Ajout des images au tableau
                        $item['images'] = $images;
                    }
                }
            }
        }

        return $data;
    }


    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return
            !isset($context[self::ALREADY_CALLED]) &&
            $data instanceof OrderInterface &&
            $this->sectionProvider->getSection() instanceof ShopApiSection &&
            $this->supportsSerializationGroups($context, $this->serializationGroups);
    }

    public function getSupportedTypes(?string $format): array
    {
        return [OrderInterface::class => false];
    }
}
