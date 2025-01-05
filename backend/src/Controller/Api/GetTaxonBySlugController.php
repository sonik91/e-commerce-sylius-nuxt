<?php

namespace App\Controller\Api;

use Doctrine\ORM\EntityManagerInterface;
use Sylius\Component\Taxonomy\Model\TaxonInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;
use ApiPlatform\Metadata\IriConverterInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class GetTaxonBySlugController
{
    private EntityManagerInterface $entityManager;
    private IriConverterInterface $iriConverter;
    private RequestStack $requestStack;

    public function __construct(EntityManagerInterface $entityManager, IriConverterInterface $iriConverter, RequestStack $requestStack)
    {
        $this->entityManager = $entityManager;
        $this->iriConverter = $iriConverter;
        $this->requestStack = $requestStack;
    }

    public function __invoke(string $slug, Request $request): RedirectResponse
    {
        // Récupérer la locale depuis les paramètres de la requête ou définir une locale par défaut
        $locale = $request->query->get('locale', 'fr_FR');

        $taxon = $this->entityManager->getRepository(TaxonInterface::class)
            ->createQueryBuilder('t')
            ->andWhere('translation.slug = :slug')
            ->innerJoin('t.translations', 'translation', 'WITH', 'translation.locale = :locale')
            ->setParameter('locale', $locale)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();

        if (null === $taxon) {
            throw new NotFoundHttpException('Not Found');
        }

        $iri = $this->iriConverter->getIriFromResource($taxon);

        $request = $this->requestStack->getCurrentRequest();

        $requestQuery = $request->getQueryString();
        if (null !== $requestQuery) {
            $iri .= sprintf('?%s', $requestQuery);
        }

        return new RedirectResponse($iri, Response::HTTP_MOVED_PERMANENTLY);

        //if (!$taxon) {
        //    throw new NotFoundHttpException(sprintf('No taxon found for slug "%s" in locale "%s".', $slug, $locale));
        //}

        //return new JsonResponse($taxon);
    }
}
