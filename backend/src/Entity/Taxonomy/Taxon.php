<?php

declare(strict_types=1);

namespace App\Entity\Taxonomy;

use Doctrine\ORM\Mapping as ORM;
use Sylius\Component\Core\Model\Taxon as BaseTaxon;
use Sylius\Component\Taxonomy\Model\TaxonTranslationInterface;

#[ORM\Entity]
#[ORM\Table(name: 'sylius_taxon')]
class Taxon extends BaseTaxon
{
    #[ORM\Column]
    private ?bool $leaf = null;

    protected function createTranslation(): TaxonTranslationInterface
    {
        return new TaxonTranslation();
    }

    public function isLeaf(): ?bool
    {
        return $this->leaf;
    }

    public function setLeaf(bool $leaf): static
    {
        $this->leaf = $leaf;

        return $this;
    }
}
