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
    category: 'pmp',
    slug: 'pmp-study-plan',
    title: {
      en: "PMP Study Plan",
      ar: "خطة دراسة ادارة المشاريع الاحترافية"
    },

    sections: [

      {
        content: {
          en: [
            "Passing the PMP exam requires a structured Methodology, much like managing a real project.",
            "Based on my experience and observing many candidates, I recommend dividing your preparation into five clear phases.",
            "Many people fail because they either mix the different phase requirements or don't fully complete one phase before moving to the next. Here are the five essential phases:"
          ],
          ar: [
            "يتطلب النجاح في اختبار PMP إلى اتباع منهجية واضحة تُدار بدقة وكأنها مشروع حقيقي.",
            "وبناءً على تجربتي الشخصية في الاختبار، بالإضافة إلى متابعة العديد من المهتمين باجتياز الاختبار الدولي، فإنني أوصي بتقسيم رحلة اجتياز الاختبار إلى خمسة مراحل متتالية.",
            "جدير بالذكر أن الكثيرين يفشلون في تحقيق الهدف المنشود بسبب عدم التمييز بين متطلبات كل مرحلة، أو عدم الالتزام باستكمال متطلبات مرحلة ما قبل الانتقال للمرحلة التالية. وهذه المراحل هي:"
          ]
        }
      },

      {
        image: "assets/images/homeArticles/pmp_article1-1.png",
        imageAlt: "pmp-study-plan",
      },
      // ================= PHASE 1 =================
      {
        title: {
          en: "Phase 1: Understanding Phase",
          ar: "المرحلة الأولى: مرحلة الفهم (Understanding Phase)"
        },
        content: {
          en: [
            "This phase represents the solid foundation for building your knowledge, aiming to grasp concepts and connect them systematically while ensuring comprehension of terminology.",
            "It's preferable to avoid attempting simulation questions during this phase and focus only on questions discussed in training sessions to prioritize understanding:"
          ],
          ar: [
            "تمثل هذه المرحلة الأساس المتين لبناء معرفتك، وتهدف إلى إدراك المفاهيم وربطها بشكل منهجي والتأكد من فهم المصطلحات.",
            "ويفضل عدم التوجه لمحاولة حل اسئلة تحاكى الاختبار الحقيقى خلال هذة المرحلة والاكتفاء بالاسئلة التى يتم مناقشتها خلال الجلسات التدريبية وذلك للتركيز اولا على الفهم:"
          ]
        },
        list: {
          en: [
            "Enroll in a PMP course and actively engage in training sessions.",
            "Study regularly after each lecture by reviewing covered materials and ensuring initial understanding of concepts and their connections.",
            "Identify unclear points and note them for discussion with the trainer in subsequent sessions.",
            "Conduct a comprehensive review after course completion using provided educational materials, reaching a level where you can explain basic concepts in your own words.",
            "Focus on deep understanding rather than memorization, as the exam depends on context comprehension rather than text recall.",
            "Master the explanation of basic terms, such as: Project Charter: A foundational document that defines project objectives, stakeholder roles, preliminary scope, timelines, and budget, formally approved by the project sponsor."
          ],
          ar: [
            "الالتحاق بدورة PMP والانخراط بفاعلية خلال الجلسات التدريبية.",
            "المذاكرة المنتظمة بعد كل محاضرة عبر مراجعة المواد المغطاة وضمان الفهم الأولي للمفاهيم وترابطها.",
            "تحديد النقاط الغامضة وتدوينها لمناقشتها مع المدرب في الجلسات اللاحقة.",
            "إجراء مراجعة شاملة بعد انتهاء الدورة باستخدام المواد التعليمية المقدمة، والوصول إلى مستوى يُمكّنك من شرح المفاهيم الأساسية بلغتك الخاصة.",
            "التركيز على الفهم العميق بدلاً من الحفظ حيث يعتمد الاختبار على استيعاب السياق وليس استرجاع النصوص.",
            "التمكن من شرح المصطلحات الأساسية بإتقان مثل: شرح عن ميثاق المشروع: وثيقة تأسيسية تُحدد أهداف المشروع وأدوار أصحاب المصلحة والنطاق الأولي والجداول الزمنية والميزانية، ويتم اعتمادها رسمياً من قبل راعي المشروع."
          ]
        }
      },

      // ================= PHASE 2 =================
      {
        title: {
          en: "Phase 2: Simulation Practice Question Phase",
          ar: "المرحلة الثانية: مرحلة المحاكاة التدريبية (Simulation Practice Question Phase)"
        },
        content: {
          en: [
            "After mastering the fundamental concepts in the first phase, the practical application phase begins through the simulation platform, which features two main training modes:"
          ],
          ar: [
            "بعد إتقان أساسيات المفاهيم في المرحلة الأولى، تبدأ مرحلة التطبيق العملي من خلال منصة المحاكاة، والتي تتميز بنمطين تدريبيين:"
          ]
        },
        list: {
          en: [
            "Practice Mode: Allows answering questions without time pressure to solidify understanding.",
            "Exam Mode: Simulates real exam conditions with time constraints.",
            "Regularly solving a large number of questions daily to build gradual experience.",
            "Dealing with initial errors as learning opportunities.",
            "Elimination Method: Ruling out incorrect answers.",
            "Focusing on the Core of the Question."
          ],
          ar: [
            "نمط التدريب (Practice Mode): يتيح حل الأسئلة بدون ضغط الوقت لترسيخ الفهم.",
            "نمط الاختبار (Exam Mode): يقلّد ظروف الاختبار الحقيقية بوقت محدد.",
            "حل عدد كبير من الاسئلة يوميًا بشكل منتظم لبناء الخبرة التدريجية.",
            "التعامل مع الأخطاء الأولية كفرص للتعلم.",
            "طريقة الاستبعاد (Elimination).",
            "التركيز على جوهر السؤال."
          ]
        }
      },

      // ================= PHASE 3 =================
      {
        title: {
          en: "Phase 3: Submitting PMP Application Phase",
          ar: "المرحلة الثالثة: تقديم طلب الاختبار (Submitting PMP Application Phase)"
        },
        list: {
          en: [
            "Completing personal details and essential professional information.",
            "Selecting the exam modality.",
            "Monitoring the application status.",
            "Average approval timeframe: approximately one week."
          ],
          ar: [
            "تعبئة البيانات الشخصية والمعلومات المهنية الأساسية.",
            "اختيار طريقة أداء الاختبار.",
            "متابعة حالة الطلب حتى الموافقة.",
            "متوسط فترة الموافقة: حوالي أسبوع."
          ]
        }
      },

      // ================= PHASE 4 =================
      {
        title: {
          en: "Phase 4: Simulation Test Question Phase",
          ar: "المرحلة الرابعة: مرحلة محاكاة الاختبار (Simulation Test Question Phase)"
        },
        list: {
          en: [
            "Simulate real exam conditions.",
            "Practice maintaining focus for 230 minutes.",
            "Achieve at least 70%."
          ],
          ar: [
            "محاكاة ظروف الاختبار الحقيقية.",
            "التمرين على الحفاظ على التركيز لمدة 230 دقيقة.",
            "تحقيق نسبة 70% على الأقل."
          ]
        }
      },

      // ================= PHASE 5 =================
      {
        title: {
          en: "Phase 5: Booking the Exam and Final Revision",
          ar: "المرحلة الخامسة: حجز الاختبار والمراجعة النهائية"
        },
        list: {
          en: [
            "Scheduling your exam.",
            "Reviewing all materials.",
            "Focusing on weak areas.",
            "Building confidence."
          ],
          ar: [
            "حجز موعد الاختبار.",
            "مراجعة جميع المواد.",
            "التركيز على نقاط الضعف.",
            "تعزيز الثقة."
          ]
        }
      },

      {
        content: {
          en: [
            "Success Assurance: We are confident that following this integrated methodology will make passing the PMP exam achievable.",
            "By: Mahmoud Elhelbawi"
          ],
          ar: [
            "ضمان النجاح: نحن على ثقة بأن الالتزام بهذه المنهجية سيجعل اجتياز الاختبار أمراً ميسراً.",
            "محمود الهلباوى"
          ]
        }
      }

    ]
},
    {
      category: 'capm',
      slug: 'capm-study-plan',
      title: {
        en: "CAPM Study Plan",
        ar: "خطة دراسة ادارة المشاريع الاحترافية"
      },

      sections: [

        {
          content: {
            en: [
              "Passing the CAPM exam requires a structured Methodology, much like managing a real project.",
              "Based on my experience and observing many candidates, I recommend dividing your preparation into five clear phases.",
              "Many people fail because they either mix the different phase requirements or don't fully complete one phase before moving to the next. Here are the five essential phases:"
            ],
            ar: [
              "يتطلب النجاح في اختبار CAPM إلى اتباع منهجية واضحة تُدار بدقة وكأنها مشروع حقيقي.",
              "وبناءً على تجربتي الشخصية في الاختبار، بالإضافة إلى متابعة العديد من المهتمين باجتياز الاختبار الدولي، فإنني أوصي بتقسيم رحلة اجتياز الاختبار إلى خمسة مراحل متتالية.",
              "جدير بالذكر أن الكثيرين يفشلون في تحقيق الهدف المنشود بسبب عدم التمييز بين متطلبات كل مرحلة، أو عدم الالتزام باستكمال متطلبات مرحلة ما قبل الانتقال للمرحلة التالية. وهذه المراحل هي:"
            ]
          }
        },

        {
          image: "assets/images/homeArticles/capm_article_1.png",
          imageAlt: "capm-study-plan",
        },

        // ================= PHASE 1 =================
        {
          title: {
            en: "Phase 1: Understanding Phase",
            ar: "المرحلة الأولى: مرحلة الفهم (Understanding Phase)"
          },
          content: {
            en: [
              "This phase represents the solid foundation for building your knowledge, aiming to grasp concepts and connect them systematically while ensuring comprehension of terminology.",
              "It's preferable to avoid attempting simulation questions during this phase and focus only on questions discussed in training sessions to prioritize understanding:"
            ],
            ar: [
              "تمثل هذه المرحلة الأساس المتين لبناء معرفتك، وتهدف إلى إدراك المفاهيم وربطها بشكل منهجي والتأكد من فهم المصطلحات.",
              "ويفضل عدم التوجه لمحاولة حل اسئلة تحاكى الاختبار الحقيقى خلال هذة المرحلة والاكتفاء بالاسئلة التى يتم مناقشتها خلال الجلسات التدريبية وذلك للتركيز اولا على الفهم:"
            ]
          },
          list: {
            en: [
              "Enroll in a CAPM course and actively engage in training sessions.",
              "Study regularly after each lecture by reviewing covered materials and ensuring initial understanding of concepts and their connections.",
              "Identify unclear points and note them for discussion with the trainer in subsequent sessions.",
              "Conduct a comprehensive review after course completion using provided educational materials, reaching a level where you can explain basic concepts in your own words.",
              "Focus on deep understanding rather than memorization, as the exam depends on context comprehension rather than text recall.",
              "Master the explanation of basic terms, such as: Project Charter: A foundational document that defines project objectives, stakeholder roles, preliminary scope, timelines, and budget, formally approved by the project sponsor."
            ],
            ar: [
              "الالتحاق بدورة CAPM والانخراط بفاعلية خلال الجلسات التدريبية.",
              "المذاكرة المنتظمة بعد كل محاضرة عبر مراجعة المواد المغطاة وضمان الفهم الأولي للمفاهيم وترابطها.",
              "تحديد النقاط الغامضة وتدوينها لمناقشتها مع المدرب في الجلسات اللاحقة.",
              "إجراء مراجعة شاملة بعد انتهاء الدورة باستخدام المواد التعليمية المقدمة، والوصول إلى مستوى يُمكّنك من شرح المفاهيم الأساسية بلغتك الخاصة.",
              "التركيز على الفهم العميق بدلاً من الحفظ حيث يعتمد الاختبار على استيعاب السياق وليس استرجاع النصوص.",
              "التمكن من شرح المصطلحات الأساسية بإتقان مثل: شرح عن ميثاق المشروع: وثيقة تأسيسية تُحدد أهداف المشروع وأدوار أصحاب المصلحة والنطاق الأولي والجداول الزمنية والميزانية، ويتم اعتمادها رسمياً من قبل راعي المشروع."
            ]
          }
        },

        // ================= PHASE 2 =================
        {
          title: {
            en: "Phase 2: Simulation Practice Question Phase",
            ar: "المرحلة الثانية: مرحلة المحاكاة التدريبية (Simulation Practice Question Phase)"
          },
          content: {
            en: [
              "After mastering the fundamental concepts in the first phase, the practical application phase begins through the simulation platform, which features two main training modes:"
            ],
            ar: [
              "بعد إتقان أساسيات المفاهيم في المرحلة الأولى، تبدأ مرحلة التطبيق العملي من خلال منصة المحاكاة، والتي تتميز بنمطين تدريبيين:"
            ]
          },
          list: {
            en: [
              "Practice Mode: Allows answering questions without time pressure to solidify understanding.",
              "Exam Mode: Simulates real exam conditions with time constraints.",
              "Regularly solving a large number of questions daily to build gradual experience.",
              "Dealing with initial errors as learning opportunities, as complete accuracy isn't expected initially.",
              "Elimination Method: Ruling out incorrect answers to identify the most accurate one.",
              "Focusing on the Core of the Question: Extracting the essential requirement from lengthy scenarios and avoiding unnecessary details.",
              "Utilizing the instructions provided in the course where these strategies are explained in practical detail."
            ],
            ar: [
              "نمط التدريب (Practice Mode): يتيح حل الأسئلة بدون ضغط الوقت لترسيخ الفهم.",
              "نمط الاختبار (Exam Mode): يقلّد ظروف الاختبار الحقيقية بوقت محدد.",
              "حل عدد كبير من الاسئلة يوميًا بشكل منتظم لبناء الخبرة التدريجية.",
              "التعامل مع الأخطاء الأولية كفرص للتعلم.",
              "طريقة الاستبعاد (Elimination): استبعاد الإجابات غير الصحيحة.",
              "التركيز على جوهر السؤال.",
              "الاستفادة من الأدوات المُقدَّمة في الدورة."
            ]
          }
        },

        // ================= PHASE 3 =================
        {
          title: {
            en: "Phase 3: Submitting CAPM Application Phase",
            ar: "المرحلة الثالثة: تقديم طلب الاختبار (Submitting CAPM Application Phase)"
          },
          list: {
            en: [
              "Completing personal details and essential professional information.",
              "Selecting the exam modality (at a test center or online).",
              "Monitoring the application status until approval.",
              "Detailed guidance for the application process is provided during the course.",
              "This phase can be completed concurrently with Phase 4.",
              "Average approval timeframe: approximately one week."
            ],
            ar: [
              "تعبئة البيانات الشخصية والمعلومات المهنية الأساسية.",
              "اختيار طريقة أداء الاختبار (في مركز الاختبار أو عبر الإنترنت).",
              "متابعة حالة الطلب حتى الموافقة.",
              "يتم شرح عملية تقديم الطلب خلال الدورة.",
              "يمكن البدء بالتوازي مع المرحلة الرابعة.",
              "متوسط فترة الموافقة: حوالي أسبوع."
            ]
          }
        },

        // ================= PHASE 4 =================
        {
          title: {
            en: "Phase 4: Simulation Test Question Phase",
            ar: "المرحلة الرابعة: مرحلة محاكاة الاختبار (Simulation Test Question Phase)"
          },
          list: {
            en: [
              "Simulate real exam conditions regarding time constraints and pressure.",
              "Practice maintaining focus for the full 230-minute duration.",
              "Achieve a passing rate of at least 70% on multiple full-length simulation exams.",
              "We recommend completing all nine practice tests available on our platform."
            ],
            ar: [
              "محاكاة ظروف الاختبار الحقيقية من حيث الزمن والضغط.",
              "التمرين على الحفاظ على التركيز لمدة 230 دقيقة.",
              "تحقيق نسبة 70% على الأقل.",
              "يوصى بأداء جميع الاختبارات المتاحة."
            ]
          }
        },

        // ================= PHASE 5 =================
        {
          title: {
            en: "Phase 5: Booking the Exam and final revision Phase",
            ar: "المرحلة الخامسة: حجز الاختبار والمراجعة النهائية"
          },
          list: {
            en: [
              "Scheduling your exam.",
              "Select the most suitable date and time.",
              "Ensure adequate preparation time.",
              "Comprehensive review of all course materials.",
              "Focus on weak areas.",
              "Build confidence through simulations."
            ],
            ar: [
              "حجز موعد الاختبار.",
              "تحديد التاريخ والوقت المناسب.",
              "توفير وقت كافٍ للمراجعة.",
              "مراجعة شاملة لجميع المواد.",
              "التركيز على نقاط الضعف.",
              "تعزيز الثقة من خلال المحاكاة."
            ]
          }
        },

        {
          content: {
            en: [
              "Success Assurance: We are confident that following this integrated methodology will make passing the CAPM exam achievable.",
              "By: Mahmoud Elhelbawi"
            ],
            ar: [
              "ضمان النجاح: نحن على ثقة بأن الالتزام بهذه المنهجية سيجعل اجتياز اختبار CAPM تجربة ميسرة ومضمونة.",
              "محمود الهلباوى"
            ]
          }
        }

      ]
    },
    {
      category: 'general',
      slug: 'digital-transformation-failure',
      title: {
        en: "Three Reasons Why Most Digital Transformation Plans Fail – And the Reason Isn't Technical",
        ar: "ثلاثة أسباب تجعل اغلب خطط التحول الرقمي تفشل والسبب ليس تقنيا"
      },

      sections: [
        {
          image: "assets/images/homeArticles/article3.png",
          imageAlt: "digital-transformation-failure",
        },
        {
          content: {
            en: [
              "70% of digital transformation initiatives fail to achieve their goals despite massive investments? And the reason is rarely technical! According to statistics from McKinsey and other consulting firms."
            ],
            ar: [
              "70% من مبادرات التحول الرقمي تفشل في تحقيق أهدافها رغم الاستثمارات الهائلة؟ والسبب نادراً ما يكون تقنياً! وذلك بحسب احصائيات McKinsey وغيرها من الشركات الاستشارية."
            ]
          }
        },

        // ================= REASON 1 =================
        {
          title: {
            en: "Reason One: Digital Transformation or Digital Patching?",
            ar: "السبب الأول: التحول الرقمي أم الترقيع الرقمي؟"
          },
          content: {
            en: [
              "Most organizations don't undergo a true transformation; they undergo digital patching.",
              "Transformation means changing identity, culture, and processes, while patching means placing new technology over old processes.",
              "Example: A CEO invested heavily in an ERP system, but employees only used 10% of its features while old processes remained."
            ],
            ar: [
              "معظم المؤسسات لا تمر بتحول حقيقي بل تمر بترقيع رقمي.",
              "التحول يعني تغيير الهوية والثقافة والعمليات، بينما الترقيع يعني إضافة التكنولوجيا فوق العمليات القديمة.",
              "مثال: مؤسسة استثمرت في نظام ERP لكن الموظفين استخدموا فقط 10% منه بينما استمرت العمليات القديمة."
            ]
          }
        },

        // ================= REASON 2 =================
        {
          title: {
            en: "Reason Two: Loss Aversion Phobia",
            ar: "السبب الثاني: فوبيا الخسارة"
          },
          list: {
            en: [
              "Transformation decisions are made after losses.",
              "Focus is on preventing losses more than creating opportunities.",
              "A defensive culture dominates."
            ],
            ar: [
              "قرارات التحول تأتي بعد خسائر.",
              "التركيز على منع الخسارة أكثر من خلق الفرص.",
              "سيطرة ثقافة الدفاع."
            ]
          },
          content: {
            en: [
              "Research shows loss pain is twice as strong as gain pleasure.",
              "Loss-driven transformation ends when pain stops, not when vision is achieved."
            ],
            ar: [
              "الأبحاث تثبت أن ألم الخسارة أقوى من متعة الربح.",
              "التحول المبني على الخسارة ينتهي عند توقف الألم."
            ]
          }
        },

        // ================= REASON 3 =================
        {
          title: {
            en: "Reason Three: Authority that Fears Transparency",
            ar: "السبب الثالث: السلطة التي تخاف من الشفافية"
          },
          content: {
            en: [
              "85% of resistance comes from middle management because transparency exposes real performance.",
              "Modern systems make performance measurable and corruption harder."
            ],
            ar: [
              "85% من المقاومة تأتي من الإدارة المتوسطة بسبب خوفهم من الشفافية.",
              "الأنظمة الحديثة تجعل الأداء قابلاً للقياس."
            ]
          }
        },

        // ================= MATRIX =================
        {
          title: {
            en: "Hidden Resistance Matrix",
            ar: "مصفوفة المقاومة الخفية"
          },
          list: {
            en: [
              "Bureaucratic Manager: fears losing authority → delays approvals",
              "Average Performer: fears exposure → spreads negativity",
              "Chaos Beneficiary: fears losing advantage → disrupts training"
            ],
            ar: [
              "المدير البيروقراطي: يخاف فقدان السلطة → يؤخر الموافقات",
              "الموظف المتوسط: يخاف الانكشاف → ينشر الشائعات",
              "مستفيد الفوضى: يخاف فقدان المكاسب → يعطل التدريب"
            ]
          }
        },

        // ================= ACTION PLAN =================
        {
          title: {
            en: "How to Avoid These Traps",
            ar: "كيف تتجنب هذه المصائد"
          },
          list: {
            en: [
              "Ask: What culture do we want to build?",
              "Measure opportunities, not savings.",
              "Win over those who fear transparency.",
              "Announce culture change, not system purchase."
            ],
            ar: [
              "اسأل: ما الثقافة التي نريد بناءها؟",
              "قم بقياس الفرص وليس التوفير.",
              "احتوِ من يخاف الشفافية.",
              "أعلن تغيير الثقافة وليس شراء نظام."
            ]
          }
        },

        {
          content: {
            en: [
              "Digital transformation begins and ends with people, not technology.",
              "The biggest success is turning resistance into support.",
              "Digital transformation is cultural surgery, not just a technical project."
            ],
            ar: [
              "التحول الرقمي يبدأ وينتهي عند الأشخاص وليس التكنولوجيا.",
              "أكبر نجاح هو تحويل المقاومة إلى دعم.",
              "التحول الرقمي هو جراحة ثقافية وليس مشروعاً تقنياً فقط."
            ]
          }
        },

        // ================= QUESTIONS =================
        {
          title: {
            en: "Ask Your Team Before Starting",
            ar: "اسأل فريقك قبل البدء"
          },
          list: {
            en: [
              "What do we lose if we don't change?",
              "What do we gain if transformation succeeds?",
              "Who will lose power with transparency?"
            ],
            ar: [
              "ما الذي نخسره إذا لم نتغير؟",
              "ما الذي نكسبه إذا نجح التحول؟",
              "من سيخسر النفوذ مع الشفافية؟"
            ]
          }
        },

        {
          content: {
            en: [
              "Honest answers can prevent 80% of failure.",
              "Source: McKinsey",
              "By: Mahmoud Elhelbawi"
            ],
            ar: [
              "الإجابات الصادقة تقلل احتمالية الفشل بنسبة كبيرة.",
              "المصدر: McKinsey",
              "محمود الهلباوى"
            ]
          }
        }

      ]
    },
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
