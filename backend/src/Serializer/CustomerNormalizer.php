<?php

declare(strict_types=1);

namespace App\Serializer;

use Sylius\Component\Core\Model\CustomerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Sylius\Bundle\ApiBundle\Serializer\SerializationGroupsSupportTrait;
use Sylius\Bundle\CoreBundle\SectionResolver\SectionProviderInterface;
use Sylius\Bundle\ApiBundle\SectionResolver\ShopApiSection;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Webmozart\Assert\Assert;

final class CustomerNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;
    use SerializationGroupsSupportTrait;

    private const ALREADY_CALLED = 'customer_normalizer_already_called';

    public function __construct(
        private readonly SectionProviderInterface $sectionProvider,
        private readonly array $serializationGroups,
        )
    {
    }

    public function normalize($object, $format = null, array $context = []): array
    {
        Assert::isInstanceOf($object, CustomerInterface::class);
        Assert::keyNotExists($context, self::ALREADY_CALLED);
        Assert::isInstanceOf($this->sectionProvider->getSection(), ShopApiSection::class);
        Assert::true($this->supportsSerializationGroups($context, $this->serializationGroups));

        $context[self::ALREADY_CALLED] = true;

        $data = $this->normalizer->normalize($object, $format, $context);

        $data['idCustomer'] = $object->getId();
        $data['order'] = $object->getOrders();

        return $data;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return
            !isset($context[self::ALREADY_CALLED]) &&
            $data instanceof CustomerInterface &&
            $this->sectionProvider->getSection() instanceof ShopApiSection &&
            $this->supportsSerializationGroups($context, $this->serializationGroups);
    }

    public function getSupportedTypes(?string $format): array
    {
        return [CustomerInterface::class => false];
    }
}
