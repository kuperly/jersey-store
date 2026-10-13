export const IMAGE = /* GraphQL */ `
  fragment ImageFields on Image { url altText width height }
`;

export const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCardFields on Product {
    id
    handle
    title
    availableForSale
    tags
    featuredImage { ...ImageFields }
    images(first: 2) { nodes { ...ImageFields } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
  }
`;

export const CART = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
    lines(first: 100) {
      nodes {
        id
        quantity
        attributes { key value }
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { ...ImageFields }
            selectedOptions { name value }
            product { title handle }
          }
        }
      }
    }
  }
`;
