import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <span class="created-by">Created by <b><a href="http://elogist.in/wordpress/" target="_blank">eLogist Team</a></b> 2019</span>`,
})
export class FooterComponent {
}
// <span class="created-by">Created by <b><a href="http://walle8.com/" target="_blank">eLogit Team</a></b> 2019</span>
//     <div class="socials">
//       <a href="#" target="_blank" class="ion ion-social-github"></a>
//       <a href="#" target="_blank" class="ion ion-social-facebook"></a>
//       <a href="#" target="_blank" class="ion ion-social-twitter"></a>
//       <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
//     </div>
//   `,