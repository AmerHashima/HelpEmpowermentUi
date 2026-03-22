import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';

@Component({
  selector: 'app-article-details',
  imports: [NgFor,NgIf],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss'
})
export class ArticleDetailsComponent {
  private shared=inject(Shared);
  currentLang=this.shared.lang;
  articles = [
    {
      category: 'capm',
      slug: 'capm-application-process',
      title: {
        en: "Your Simple Guide to the CAPM Application Process",
        ar: "دليلك البسيط للتقديم على شهادة CAPM"
      },

      sections: [
        {
          image: "assets/images/homeArticles/article1.jpeg",
          imageAlt: "capm-application-process",

          content: {
            en: [
              "Thinking about the CAPM certification? Smart move. It's the perfect launchpad for your project management career.",
              "The application is straightforward—easier than the PMP, and we'll walk you through the current, updated process step-by-step."
            ],
            ar: [
              "هل تفكر في الحصول على شهادة CAPM؟ اختيار ذكي. إنها البداية المثالية لمسيرتك المهنية في إدارة المشاريع.",
              "عملية التقديم سهلة وبسيطة—أسهل من PMP—وسنرشدك خلال الخطوات المحدثة خطوة بخطوة."
            ]
          }
        },

        {
          title: {
            en: "What You Need Before Starting",
            ar: "ما الذي تحتاجه قبل البدء"
          },
          content: {
            en: ["Gather just two things:"],
            ar: ["ستحتاج فقط إلى شيئين:"]
          },
          list: {
            en: [
              "Your Education Proof: Have your high school diploma, associate's degree, or equivalent ready. This is the only educational requirement.",
              "Your 23-Hour Training Proof: You must complete 23 contact hours of project management education and keep the certificate."
            ],
            ar: [
              "إثبات التعليم: يجب أن يكون لديك شهادة الثانوية أو ما يعادلها، وهو الشرط التعليمي الوحيد.",
              "إثبات 23 ساعة تدريب: يجب إكمال 23 ساعة تدريبية في إدارة المشاريع والحصول على الشهادة."
            ]
          }
        },

        {
          content: {
            en: [
              "That's it. Unlike the PMP, you do NOT need any professional project management experience.",
              "This makes CAPM ideal for students, career changers, and beginners."
            ],
            ar: [
              "هذا كل ما تحتاجه. على عكس شهادة PMP، لا تحتاج إلى خبرة عملية في إدارة المشاريع.",
              "وهذا يجعل CAPM مناسبة للطلاب والمبتدئين ومن يرغبون في تغيير مسارهم المهني."
            ]
          }
        },

        {
          title: {
            en: "The Application Process: Three Easy Steps",
            ar: "خطوات التقديم: ثلاث خطوات سهلة"
          }
        },

        {
          title: {
            en: "Step 1: Create Your PMI Account",
            ar: "الخطوة الأولى: إنشاء حساب PMI"
          },
          list: {
            en: [
              "Go to the PMI website.",
              "Click Join or Log In and create a free account.",
              "Use a personal email you check regularly."
            ],
            ar: [
              "اذهب إلى موقع PMI.",
              "اضغط على تسجيل أو تسجيل الدخول وأنشئ حسابًا مجانيًا.",
              "استخدم بريدًا إلكترونيًا شخصيًا تتحقق منه باستمرار."
            ]
          }
        },

        {
          title: {
            en: "Step 2: Start and Complete the CAPM Application",
            ar: "الخطوة الثانية: بدء وإكمال طلب CAPM"
          },
          content: {
            en: [
              "Go to Certifications in your PMI account and select CAPM.",
              "Click Apply."
            ],
            ar: [
              "انتقل إلى قسم الشهادات في حساب PMI واختر CAPM.",
              "اضغط على تقديم الطلب."
            ]
          },
          list: {
            en: [
              "Enter personal information.",
              "Confirm your education.",
              "Add training details.",
              "Enter provider name, course name, and completion date.",
              "Confirm 23 hours completed.",
              "Review everything carefully."
            ],
            ar: [
              "أدخل بياناتك الشخصية.",
              "أكد بيانات التعليم.",
              "أدخل تفاصيل التدريب.",
              "أضف اسم الجهة التدريبية واسم الدورة وتاريخ الانتهاء.",
              "أكد إتمام 23 ساعة تدريب.",
              "راجع البيانات جيدًا."
            ]
          }
        },

        {
          title: {
            en: "Step 3: Submit, Pay, and Schedule",
            ar: "الخطوة الثالثة: التقديم والدفع وحجز الامتحان"
          },
          list: {
            en: [
              "Submit application and pay fee.",
              "PMI membership may reduce cost.",
              "Approval is usually instant or within 24 hours.",
              "Receive eligibility ID.",
              "Schedule your exam within one year."
            ],
            ar: [
              "قم بإرسال الطلب ودفع الرسوم.",
              "قد يساعدك الاشتراك في PMI على تقليل التكلفة.",
              "يتم قبول الطلب غالبًا فورًا أو خلال 24 ساعة.",
              "ستحصل على رقم الأهلية.",
              "قم بحجز الامتحان خلال سنة."
            ]
          }
        },

        {
          title: {
            en: "Important Notes",
            ar: "ملاحظات مهمة"
          },
          list: {
            en: [
              "Audits are rare but possible.",
              "Your name must match your ID exactly."
            ],
            ar: [
              "التدقيق نادر ولكنه ممكن.",
              "يجب أن يتطابق اسمك تمامًا مع بطاقة الهوية."
            ]
          }
        },

        {
          title: {
            en: "What Comes After Approval?",
            ar: "ماذا بعد قبول الطلب؟"
          },
          content: {
            en: [
              "Now the real work begins: preparing for the exam.",
              "Use your one-year eligibility wisely."
            ],
            ar: [
              "الآن تبدأ المرحلة الأهم: التحضير للامتحان.",
              "استغل فترة السنة للتحضير بشكل جيد."
            ]
          }
        },

        {
          content: {
            en: [
              "The CAPM application is simple and accessible.",
              "Complete it correctly and start your certification journey."
            ],
            ar: [
              "عملية التقديم لـ CAPM سهلة ومباشرة.",
              "أكملها بشكل صحيح وابدأ رحلتك نحو الشهادة."
            ]
          }
        },

        {
          title: {
            en: "Final Tip",
            ar: "نصيحة أخيرة"
          },
          content: {
            en: [
              "Need the 23-hour training?",
              "Our CAPM course provides certificate + exam readiness."
            ],
            ar: [
              "هل تحتاج إلى إكمال 23 ساعة تدريب؟",
              "دورتنا توفر الشهادة والاستعداد الكامل للامتحان."
            ]
          }
        }
      ]
    }
  ]
  article: any;

  constructor(private route: ActivatedRoute,private router:Router) { }

  loadArticle() {
    const category = this.route.snapshot.paramMap.get('category');
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log('category', category);
    console.log('slug',slug);
    this.article = this.articles.find(a =>
      a.category === category && a.slug === slug
    );
    console.log('article',this.article);
    if (!this.article) {
      this.router.navigate(['/not-found']);
    }
  }

  ngOnInit() {
    this.loadArticle();
  }
 

}
