<?php

declare(strict_types=1);

namespace App\Form\Extension;

use Sylius\Bundle\TaxonomyBundle\Form\Type\TaxonType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormBuilderInterface;

class CustomTaxonTypeExtension extends AbstractTypeExtension
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('leaf', CheckboxType::class, [
            'required' => false,
            'label' => 'Is Leaf',
        ]);
    }

    public static function getExtendedTypes(): iterable
    {
        return [TaxonType::class];
    }
}
