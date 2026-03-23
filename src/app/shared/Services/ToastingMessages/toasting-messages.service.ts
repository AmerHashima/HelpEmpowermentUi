// // src\app\shared\Services\ToastingMessages\toasting-messages.service.ts
// import { Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { TranslateService } from '@ngx-translate/core';
// @Injectable({
//   providedIn: 'root'
// })
// export class ToastingMessagesService {

//   constructor(
//     private _ToastrService: ToastrService,
//     private translateService: TranslateService
//   ) { }

//   showToast(toastMessage: string, type: 'success' | 'error' | 'info' | 'warning') {
//     const titleKey = `TOAST.${type.toUpperCase()}`;
//     const translatedTitle = this.translateService.instant(titleKey);
//     // const translatedTitle = type;

//     const message = this.translateService.instant(toastMessage);
//     // const message = toastMessage;

//     this._ToastrService.clear();
//     switch (type) {
//       case 'success':
//         this._ToastrService.success(message, translatedTitle);
//         break;
//       case 'error':
//         this._ToastrService.error(message, translatedTitle);
//         break;
//       case 'info':
//         this._ToastrService.info(message, translatedTitle);
//         break;
//       case 'warning':
//         this._ToastrService.warning(message, translatedTitle);
//         break;
//     }
//   }
// }


// src/app/shared/Services/ToastingMessages/toasting-messages.service.ts

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class ToastingMessagesService {

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  showToast(messageKey: string, type: ToastType, clear = true) {
    this.handleToast(messageKey, type, clear);
  }

  private handleToast(messageKey: string, type: ToastType, clear = true) {
    const titleKey = `TOAST.${type.toUpperCase()}`;

    const title = this.translate.instant(titleKey) || type;
    const message = this.translate.instant(messageKey) || messageKey;

    if (clear) {
      this.toastr.clear();
    }

    this.toastr[type](message, title);
  }

  success(message: string, clear = true) {
    this.handleToast(message, 'success', clear);
  }

  error(message: string, clear = true) {
    this.handleToast(message, 'error', clear);
  }

  info(message: string, clear = true) {
    this.handleToast(message, 'info', clear);
  }

  warning(message: string, clear = true) {
    this.handleToast(message, 'warning', clear);
  }
}
