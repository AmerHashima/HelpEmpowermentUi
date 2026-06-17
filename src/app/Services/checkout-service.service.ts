import { inject, Injectable } from '@angular/core';
import { APICartItem } from '../models/cart';
import { concatMap, forkJoin, from, of } from 'rxjs';
import { StudentService } from './student-service.service';
import { LookupDetail } from '../models/lookup';
import { LOOKUP_CODES, LookupService } from './lookup.service';
import { ReservationService } from './reservation.service';
import { createdUpdatedOID } from '../data/lookUPS';
import { CertificationService } from './certification.service';
import { APICourseService } from '../models/course-service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private studentService = inject(StudentService);
  private certificationService=inject(CertificationService);

  private lookupService = inject(LookupService);

  private reservationService = inject(ReservationService);

  private serviceTypes: LookupDetail[] = [];

  constructor() {

    this.loadServiceTypes();

  }

  checkout(

    cartItems: APICartItem[],

    paymentMethod: string

  ) {

    const groupedCourses = this.groupByCourse(cartItems);

    return from(groupedCourses).pipe(

      concatMap(([_, items]) => {

        const studentCoursePayload =

          this.buildStudentCoursePayload(

            items,

            paymentMethod

          );

        return this.studentService

          .enrollCourse(studentCoursePayload)

          .pipe(

            concatMap(studentCourse =>

              this.certificationService

                .getCourseServicesByCourse(studentCoursePayload.courseId)

                .pipe(

                  concatMap((services: APICourseService[]) => {

                    const reservations: any[] = [];

                    const examTypeId = this.serviceTypes.find(

                      x => x.lookupValue === 'EXAM_SIMULATION'

                    )?.oid;

                    const recordedTypeId = this.serviceTypes.find(

                      x => x.lookupValue === 'RECORDED_COURSE'

                    )?.oid;

                    const liveTypeId = this.serviceTypes.find(

                      x => x.lookupValue === 'LIVE_COURSE'

                    )?.oid;

                    const examService = services.find(

                      x => x.serviceId === examTypeId

                    );

                    const recordedService = services.find(

                      x => x.serviceId === recordedTypeId

                    );

                    const liveService = services.find(

                      x => x.serviceId === liveTypeId

                    );

                    if (

                      studentCoursePayload.examSimulationReserv &&

                      examService

                    ) {

                      reservations.push(

                        this.buildReservationPayload(

                          studentCourse.oid,

                          examService.oid,

                          examService.price ?? 0,

                          studentCoursePayload.studentId

                        )

                      );

                    }

                    if (

                      studentCoursePayload.recordedCourseReserv &&

                      recordedService

                    ) {

                      reservations.push(

                        this.buildReservationPayload(

                          studentCourse.oid,

                          recordedService.oid,

                          recordedService.price ?? 0,

                          studentCoursePayload.studentId

                        )

                      );

                    }

                    if (

                      studentCoursePayload.liveCourseReserv &&

                      liveService

                    ) {

                      reservations.push(

                        this.buildReservationPayload(

                          studentCourse.oid,

                          liveService.oid,

                          liveService.price ?? 0,

                          studentCoursePayload.studentId

                        )

                      );

                    }

                    if (!reservations.length) {

                      return of(null);

                    }

                    return forkJoin(

                      reservations.map(payload =>

                        this.reservationService

                          .CreateReservation(payload)

                      )

                    );

                  })

                )

            )

          );

      })

    );

  }

  // checkout(

  //   cartItems: APICartItem[],

  //   paymentMethod: string

  // ) {

  //   const groupedCourses = this.groupByCourse(cartItems);

  //   return from(groupedCourses).pipe(

  //     concatMap(([_, items]) => {

  //       const studentCoursePayload =

  //         this.buildStudentCoursePayload(

  //           items,

  //           paymentMethod

  //         );

  //       return this.studentService

  //         .enrollCourse(studentCoursePayload)

  //         .pipe(

  //           concatMap(studentCourse => {

  //             const reservations: any[] = [];

  //             const examServiceType =

  //               this.serviceTypes.find(

  //                 x => x.lookupValue === 'EXAM_SIMULATION'

  //               );

  //             const recordedServiceType =

  //               this.serviceTypes.find(

  //                 x => x.lookupValue === 'RECORDED_COURSE'

  //               );

  //             const liveServiceType =

  //               this.serviceTypes.find(

  //                 x => x.lookupValue === 'LIVE_COURSE'

  //               );

  //             if (

  //               studentCoursePayload.examSimulationReserv &&

  //               examServiceType

  //             ) {

  //               reservations.push(

  //                 this.buildReservationPayload(

  //                   studentCourse.oid,

  //                   examServiceType.oid,

  //                   0,

  //                   studentCoursePayload.studentId

  //                 )

  //               );

  //             }

  //             if (

  //               studentCoursePayload.recordedCourseReserv &&

  //               recordedServiceType

  //             ) {

  //               reservations.push(

  //                 this.buildReservationPayload(

  //                   studentCourse.oid,

  //                   recordedServiceType.oid,

  //                   0,

  //                   studentCoursePayload.studentId

  //                 )

  //               );

  //             }

  //             if (

  //               studentCoursePayload.liveCourseReserv &&

  //               liveServiceType

  //             ) {

  //               reservations.push(

  //                 this.buildReservationPayload(

  //                   studentCourse.oid,

  //                   liveServiceType.oid,

  //                   0,

  //                   studentCoursePayload.studentId

  //                 )

  //               );

  //             }

  //             if (!reservations.length) {

  //               return of(null);

  //             }

  //             return forkJoin(

  //               reservations.map(payload =>

  //                 this.reservationService.CreateReservation(payload)

  //               )

  //             );

  //           })

  //         );

  //     })

  //   );

  // }

  // Helpers

  private groupByCourse(cartItems: APICartItem[]) {

    const grouped = new Map<string, APICartItem[]>();

    cartItems.forEach(item => {

      const existing =

        grouped.get(item.courseId) || [];

      existing.push(item);

      grouped.set(item.courseId, existing);

    });

    console.log('GroupNByCOurse', Array.from(grouped.entries()));
    return Array.from(grouped.entries());

  }

  private buildStudentCoursePayload(

    items: APICartItem[],

    paymentMethod: string

  ) {

    const first = items[0];

    return {

      studentId: first.studentId,

      courseId: first.courseId,

      price: items.reduce(

        (sum, x) => sum + x.finalPrice,

        0

      ),

      discountAmount: items.reduce(

        (sum, x) => sum + x.discountAmount,

        0

      ),

      examSimulationReserv: items.some(

        x => x.examSimulationReserv

      ),

      recordedCourseReserv: items.some(

        x => x.recordedCourseReserv

      ),

      liveCourseReserv: items.some(

        x => x.liveCourseReserv

      ),

      paymentMethod,

      createdBy: createdUpdatedOID
      // createdBy: first.studentId


    };

  }

  private buildReservationPayload(

    studentCourseId: string,

    courseServiceId: string,

    servicePrice: number,

    studentId: string

  ) {

    return {

      studentCourseId,

      courseServiceId,

      reservationDate: new Date().toISOString(),

      servicePrice,

      isReserved: true,

      notes: '',

      createdBy: createdUpdatedOID
      // createdBy: studentId


    };

  }

  private loadServiceTypes() {

    this.lookupService

      .getLookUpByCode(LOOKUP_CODES.SERVICE_TYPE)

      .subscribe({

        next: types => {

          this.serviceTypes = types ?? [];

        },

        error: () => {

          this.serviceTypes = [];

        }

      });

  }

}


