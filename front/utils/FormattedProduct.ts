import type { Product } from '~/types/Product';
import type  { Variant } from '~/types/Variant';
import type { Image } from '~/types/Image';
import type { Option } from '~/types/Option';

export const formatProduct = (item: any): Product => {
  // Formater les images
  const images: Image[] = item.images?.map((image: any) => ({
    "@id": image['@id'] || null,
    "@type": image['@type'] || null,
    id: image.id || null,
    type: image.type || null,
    path: image.path || '/defaultProduct.jpg',
  })) || [];

  // Formater les variantes
  const variants: Variant[] = item.variants?.map((variant: any) => ({
    '@id': variant['@id'],
    id: variant.id,
    position: variant.position,
    enabled: variant.enabled,
    code: variant.code,
    name: variant.name || null,
    inStock: variant.inStock,
    weight: variant.weight || null,
    width: variant.width || null,
    height: variant.height || null,
    depth: variant.depth || null,
    price: variant.price || null,
    originalPrice: variant.originalPrice || null,
    lowestPriceBeforeDiscount: variant.lowestPriceBeforeDiscount || null,
    isDefault: variant.isDefault,
    options: variant.options,
  })) || [];

  const options: Option[] = [];
  
  variants.forEach(variant => {
        variant.options.forEach(option => {
          if(!options.some(item => item.code === option.code)){
            options.push({code: option.code, name: option.name, value: []})
          }

          const optionActual = options.find(item => item.code === option.code);

          try{
            if(!optionActual?.value.some(item => item === option.value)){
              optionActual?.value.push(option.value)
            }
          }
          catch(error: any){
            console.error('optionActual.value n\'est pas un array dans le formatage du produit');
          }
        });
  });

  // Trouver la variante par défaut
  const defaultVariant = variants.find((variant: Variant) => variant.isDefault);

  // Retourner le produit formaté
  return {
    id: item.id,
    mainTaxon: item.mainTaxon,
    averageRating: item.averageRating || 0,
    reviews: item.reviews,
    images: images.length > 0 ? images : <Image[]> [{ '@id': null, '@type': null, id: null, type: null, path: '/defaultProduct.jpg' }],
    code: item.code,
    slug: item.slug,
    options: options,
    associations: item.associations,
    updatedAt: item.updatedAt,
    name: item.name || 'Unknown Product',
    shortDescription: item.shortDescription,
    description: item.description,
    currency: item.currencySymbol,
    url: `products/${item.slug}`,
    variant: variants,
    defaultVariant: defaultVariant || null,
  };
};
