export interface InfoSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface InfoPageContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly sections: readonly InfoSection[];
}

export type InfoPageKey = 'contact' | 'shipping' | 'faq' | 'careers' | 'privacy';

/**
 * Static placeholder copy. Replace with real policy/contact details before launch — none of it is
 * legal text, and it deliberately avoids specific promises (delivery times, return windows, emails).
 */
export const INFO_PAGES: Readonly<Record<InfoPageKey, InfoPageContent>> = {
  contact: {
    eyebrow: 'Support',
    title: 'Contact us',
    intro: 'Questions about an order, a product, or your account? We are happy to help.',
    sections: [
      {
        heading: 'Order questions',
        paragraphs: [
          'Sign in and open your order history to see the status and contents of every order you have placed.',
          'When you get in touch about an order, include your order number so we can find it quickly.'
        ]
      },
      {
        heading: 'Product questions',
        paragraphs: ['Each product page lists its materials, dimensions, and current availability.']
      },
      {
        heading: 'Get in touch',
        paragraphs: ['Email us at support@aurelia.example and we will reply as soon as we can.']
      }
    ]
  },
  shipping: {
    eyebrow: 'Support',
    title: 'Shipping & returns',
    intro: 'What to expect once you place an order, and what to do if something is not right.',
    sections: [
      {
        heading: 'Shipping',
        paragraphs: [
          'Your order total is shown in your cart before you check out.',
          'You can follow the status of every order from your order history.'
        ]
      },
      {
        heading: 'Returns',
        paragraphs: [
          'If an item is not what you expected, contact us with your order number and we will talk you through the options.'
        ]
      },
      {
        heading: 'Damaged or missing items',
        paragraphs: ['Let us know as soon as possible, with a photo where relevant, and we will make it right.']
      }
    ]
  },
  faq: {
    eyebrow: 'Support',
    title: 'Frequently asked questions',
    intro: 'Quick answers to the things we are asked most.',
    sections: [
      {
        heading: 'Do I need an account to shop?',
        paragraphs: [
          'You can browse and fill a cart without one. You need an account to check out, save a wishlist, view your order history, or leave a review.'
        ]
      },
      {
        heading: 'Will my cart be saved?',
        paragraphs: ['Your cart is kept in your browser, so it is still there when you come back on the same device.']
      },
      {
        heading: 'Can I change my review?',
        paragraphs: [
          'Yes. You can leave one review per product and edit or delete it at any time from the product page.'
        ]
      },
      {
        heading: 'How do I find a product?',
        paragraphs: ['Use the search icon, browse the shop, or pick a category.']
      }
    ]
  },
  careers: {
    eyebrow: 'Company',
    title: 'Careers',
    intro: 'We are a small team that cares about good design and a good shopping experience.',
    sections: [
      {
        heading: 'Open roles',
        paragraphs: ['There are no open roles right now, but we are always glad to hear from thoughtful people.']
      },
      {
        heading: 'Say hello',
        paragraphs: ['Send a short note about yourself to careers@aurelia.example.']
      }
    ]
  },
  privacy: {
    eyebrow: 'Company',
    title: 'Privacy policy',
    intro: 'A plain-language summary of the information this store handles.',
    sections: [
      {
        heading: 'Information we store',
        paragraphs: [
          'When you create an account we store your sign-in details. When you shop we store your orders, wishlist, and any reviews you write.'
        ]
      },
      {
        heading: 'Stored in your browser',
        paragraphs: ['Your cart is saved in your browser on your own device and is not sent to us until you check out.']
      },
      {
        heading: 'Your choices',
        paragraphs: [
          'You can edit or delete your reviews and remove items from your wishlist at any time. Contact us if you would like help with anything else.'
        ]
      }
    ]
  }
};
