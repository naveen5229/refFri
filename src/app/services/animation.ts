import { trigger, style, transition, animate,state } from '@angular/animations';
export function routerTransition() {
   
     return slideToRight();
     return slideToLeft();
}
export function slideToLeft() {
    return trigger('routerTransition', [
        state('void', style({})),
        state('*', style({})),

        transition(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('1s ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('1s ease-in-out', style({ transform: 'translateX(-100%)' }))
        ]),

    ]);
}
export function slideToRight() {
    return trigger('routerTransition', [
        state('void', style({})),
        state('*', style({})),

        transition(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('1s ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('1s ease-in-out', style({ transform: 'translateX(100%)' }))
        ]),

    ]);

}