/*Summary

Built the foundation and Home feature for the Angular e-commerce app at /Users/vpotaraju/private projects/web-apps/e-commerce-app:

Architecture (designed for all 20 future features without refactoring):
- core/ — singleton services, DI interfaces/tokens, layout shell (navbar, footer)
- shared/ — reusable ProductCard component, currency util, empty scaffolds for pipes/directives/animations
- features/home/ — hero, featured-products, categories components + home page, lazy-loaded via its own routes file
- features/{cart,wishlist,product,auth,profile,orders,admin,checkout}/ — empty placeholders ready for future work
- models/ — Product, Category, Money interfaces with fields anticipating filters, ratings, inventory
- data/mock/ — JSON mock data for products and categories

Key architectural decisions:
- Services abstracted behind interfaces (ProductCatalog, CategoryCatalog) and wired via InjectionTokens in app.config.ts — swapping mock data for a real backend later is a one-line change, zero component changes.
- Zoneless change detection + Signals (toSignal, input(), computed()) throughout; components use OnPush.
- Business logic lives in services, not components.
- Accessibility: semantic landmarks, aria-labels on icon buttons, focus-visible states, prefers-reduced-motion handling.
- Lazy loading already proven end-to-end (home chunk splits separately in the build output).

Verified: ng build succeeds (lazy chunks confirmed), unit tests pass (2/2). I don't have browser tooling in this session, so I could not visually confirm the rendered page — please run yarn start and check http://localhost:4300 yourself, or let me know if you'd like me to try another verification method.

Let me know if the Home page looks right before I continue to the next feature. */

/*
signals
- don't need zone for it
- instead of Angular checking on changes, signals tell the angular that I changed

1. derived signals - reactive relationships
2. effects - whenever a signal changes - reactive and controlled manner
  effect() {
    reference your signal   
  }
3. doesn't blindly re-render everything when some changes happen - it surgically changes that particular value which signal defines
   the default changedetection re-runs the entire component and its child component too - except the one that has OnPush strategy

NgZone actually checks for all the asynchronous events that happens - and based on that it triggers a full change detection cycle. That 
cycle checks your component tree and see what's all being changed - and then re-renders. signals bypasses that.

zone.js is a part of angular-core

zone.js notifies Angular that some asynchronous event has 
Angular triggers change detection and goest through the component tree and it check bindings

scheduling mechanism - it helps Angular when to queue changedetection, its like ngzone signalling async operation done - you do scheduling

zoneless changes
    - explicit state updates
    - 

zonejs usually includes asynchronous events - so any third party library can be considered that it will included

onpush component in Angular
    - don't check me everytime - only check me when any of the Input  REFERENCES changes or any async events happen inside me
    - async pipe to observable also gets triggered like
        - user$ | async
            - now whenever user$ emits it will trigger this async pipe



markForCheck() -> don't check me now - check me in the next round of change detection
detectChanges() -> stop right now - check me now see for any changes

- async pipe
    - price$ | async   ---> this is in the template
        - its a way of subscribing to an observable in the template
        - so whenever the stream of values comes up - it can take care of it and we show it
            - like in stock prices

*/

/*

Javascript
event loop
micro (promise callbacks) - first and macro tasks (setTimeout) - later
Host APIs 
    - browser's timer API enqueues the macrotask
    - javascript engine - for promises,  enqueues mircrotasks
why promise callbacks run before timeout
*/
