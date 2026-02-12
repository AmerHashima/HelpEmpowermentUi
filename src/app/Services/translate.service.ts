// src\app\Services\translate.service.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from '../shared/Services/ApiService/api.service';

interface TranslateResponse {
    translatedText?: string;
    originalText?: string;
    sourceLanguage?: string | null;
    targetLanguage?: string;
}

@Injectable({ providedIn: 'root' })
export class TranslateService {
    private endpoint = 'Translate/en-to-ar';

    constructor(private apiService: ApiService) { }
    translateEnToAr(text: string): Observable<string> {
        return this.apiService
            .post<TranslateResponse>(this.endpoint, { text: text })
            .pipe(
                map((response: TranslateResponse) => {
                    const translated = response?.translatedText ?? '';
                    return translated;
                })
            );
    }

    // translateEnToAr(text: string): Observable<string> {
    //     return this.apiService
    //         .post<TranslateResponse>(this.endpoint, { text })
    //         .pipe(
    //             map((response: TranslateResponse) => {
    //                 const translated = response?.translatedText ?? '';
    //                 if (!translated) {
    //                     throw new Error('Translate API returned empty result');
    //                 }
    //                 return translated;
    //             })
    //         );
    // }
}
