<?php

declare(strict_types=1);

namespace App\Serializer;

use Sylius\Component\Core\Model\TaxonInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Sylius\Bundle\ApiBundle\Serializer\SerializationGroupsSupportTrait;
use Sylius\Bundle\CoreBundle\SectionResolver\SectionProviderInterface;
use Sylius\Bundle\ApiBundle\SectionResolver\ShopApiSection;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Webmozart\Assert\Assert;

final class TaxonNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;
    use SerializationGroupsSupportTrait;

    private const ALREADY_CALLED = 'taxon_normalizer_already_called';

    public function __construct(
        private readonly SectionProviderInterface $sectionProvider,
        private readonly array $serializationGroups,
        )
    {
    }

    public function normalize($object, $format = null, array $context = []): array
    {
        Assert::isInstanceOf($object, TaxonInterface::class);
        Assert::keyNotExists($context, self::ALREADY_CALLED);
        Assert::isInstanceOf($this->sectionProvider->getSection(), ShopApiSection::class);
        Assert::true($this->supportsSerializationGroups($context, $this->serializationGroups));

        $context[self::ALREADY_CALLED] = true;

        $data = $this->normalizer->normalize($object, $format, $context);

        $data['children'] = $this->normalizeChildren($object->getChildren(), $format, $context);
        $data['isLeaf'] = $object->isLeaf();

        return $data;
    }

    private function normalizeChildren($children, $format, array $context): array
    {
        $normalizedChildren = [];

        foreach ($children as $child) {
            // Normaliser chaque enfant
            $normalizedChild = $this->normalizer->normalize($child, $format, $context);

            // Ajouter les enfants du niveau suivant
            $normalizedChild['children'] = $this->normalizeChildren($child->getChildren(), $format, $context);
            $normalizedChild['isLeaf'] = $child->isLeaf();

            $normalizedChildren[] = $normalizedChild;
        }

        return $normalizedChildren;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return
            !isset($context[self::ALREADY_CALLED]) &&
            $data instanceof TaxonInterface &&
            $this->sectionProvider->getSection() instanceof ShopApiSection &&
            $this->supportsSerializationGroups($context, $this->serializationGroups);
    }

    public function getSupportedTypes(?string $format): array
    {
        return [TaxonInterface::class => false];
    }
}
