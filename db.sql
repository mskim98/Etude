Table "public"."user_ap_result" {
  "user_id" uuid [not null]
  "ap_exam_id" uuid [not null]
  "tested_at" timestamp [not null]
  "completed_at" timestamp
  "duration" interval
  "correct_amount" bigint
}

Table "public"."ap_exam_question" {
  "id" uuid [pk, not null, ref: < "public"."user_ap_wrong_answer"."ap_question_id"]
  "ap_exam_id" uuid [not null, ref: < "public"."ap_exam"."id"]
  "order_field" bigint [not null, note: 'Original name was "order" (renamed due to SQL keyword conflict).']
  "question" text [not null]
  "passage" text [not null]
  "choice_type" text [not null, note: 'text, image']
  "difficulty" text [not null, note: 'easy, normal, hard']
  "topic" text [not null]
}

Table "public"."ap" {
  "id" uuid [pk, not null]
  "service_id" uuid [not null, ref: < "public"."Service"."id"]
  "teacher_id" uuid [not null, ref: < "public"."profile"."id"]
  "title" text [not null]
  "is_active" boolean [not null]
}

Table "public"."sat_test_question" {
  "id" uuid [pk, not null, ref: < "public"."user_sat_wrong_answer"."sat_question_id", ref: < "public"."sat_test_spr"."question_id"]
  "sat_test_id" uuid [not null, ref: < "public"."sat"."id"]
  "order_field" bigint [not null, note: 'Original name was "order" (renamed due to SQL keyword conflict).']
  "question" text [not null]
  "passage" text [not null]
  "type" text [not null, note: 'mcq, spr']
  "score" bigint [not null]
  "topic" text
}

Table "public"."user_service" {
  "id" uuid [pk, not null]
  "user_id" uuid [not null, ref: < "public"."profile"."id"]
  "service_id" uuid [not null, ref: < "public"."Service"."id"]
  "is_active" boolean [not null, default: false]
}

Table "public"."sat_test_mcq" {
  "id" uuid [pk, not null]
  "question_id" uuid [not null, ref: < "public"."sat_test_question"."id"]
  "choice_text" text [not null]
  "is_answer" boolean [default: false]
}

Table "public"."sat" {
  "id" uuid [pk, not null, ref: < "public"."user_sat_test"."sat_id"]
  "service_id" uuid [not null, ref: < "public"."Service"."id"]
  "title" text [not null]
  "type" text [not null, note: 'reading, writing, math']
  "description" text [not null]
  "difficulty" text [not null, note: 'easy, normal, hard']
  "duration" bigint [not null]
  "quantity" bigint [not null]
  "is_active" boolean [not null]
}

Table "public"."profile" {
  "id" uuid [pk, not null, ref: < "public"."announcement"."announced_by", ref: < "public"."user_ap_result"."user_id"]
  "role" text [not null, default: `student`, note: 'student, teacher, admin']
  "state" text [not null, default: `pending`, note: 'pending, approve']
  "name" text [not null]
  "university" text
  "major" text
  "gpa" decimal
  "ap_score" decimal
  "sat_score" decimal
  "created_at" timestamp [not null]
  "updated_at" timestamp [not null]
  "deleted_at" timestamp
}

Table "public"."user_sat_wrong_answer" {
  "id" uuid [pk, not null]
  "sat_result_id" uuid [not null]
  "sat_question_id" uuid [not null]
}

Table "public"."ap_exam" {
  "id" uuid [pk, not null, ref: < "public"."ap_exam_video"."ap_exam_id", ref: < "public"."user_ap_result"."ap_exam_id"]
  "subject_id" uuid [not null, ref: < "public"."ap"."id"]
  "title" text [not null]
  "description" text [not null]
  "duration" decimal [not null]
  "quantity" bigint [not null]
  "difficulty" text [not null, note: 'easy, normal, hard']
  "is_active" boolean
}

Table "public"."user_sat_result" {
  "id" uuid [pk, not null, ref: < "public"."user_sat_wrong_answer"."sat_result_id"]
  "user_id" uuid [not null, ref: < "public"."profile"."id"]
  "sat_id" uuid [not null, ref: < "public"."sat"."id"]
  "score_category" text [not null, note: 'reading, writing, math']
  "score" decimal
  "accuracy" decimal
  "tested_at" timestamp [not null]
  "completed_at" timestamp
  "duration" interval
}

Table "public"."Service" {
  "id" uuid [pk, not null]
  "service_name" text [not null]
  "is_active" boolean [not null]
}

Table "public"."ap_exam_video" {
  "id" uuid [pk, not null]
  "ap_exam_id" uuid [not null]
  "is_active" boolean [not null]
  "video_url" text [not null]
}

Table "public"."ap_frq" {
  "id" uuid [pk, not null]
  "chapter_id" uuid [not null, ref: < "public"."chapter"."id"]
  "is_active" boolean [not null, default: false]
}

Table "public"."schedule" {
  "id" uuid [pk, not null]
  "title" text [not null]
  "d_day" date [not null]
  "category" text [not null, note: 'ap,sat']
}

Table "public"."ap_mcq" {
  "id" uuid [pk, not null]
  "chapter_id" uuid [not null, ref: < "public"."chapter"."id"]
  "is_active" boolean [not null, default: false]
}

Table "public"."user_ap_subject" {
  "id" uuid [pk, not null]
  "user_service_id" uuid [not null, ref: < "public"."user_service"."id"]
  "subject_id" uuid [not null, ref: < "public"."ap"."id"]
  "is_active" boolean [not null]
  "start_at" timestamp
  "end_at" timestamp
  "created_at" timestamp [not null]
  "updated_at" timestamp [not null]
  "deleted_at" timestamp
}

Table "public"."ap_chapter_video" {
  "id" uuid [pk, not null]
  "chapter_id" uuid [not null, ref: < "public"."chapter"."id"]
  "is_active" boolean [not null]
}

Table "public"."auth.users" {
  "id" uuid [pk, not null, ref: < "public"."profile"."id"]
  "email" varchar(500) [unique, not null]
  "password" varchar(500) [not null]
}

Table "public"."chapter" {
  "id" uuid [pk, not null]
  "subject_id" uuid [ref: < "public"."ap"."id"]
  "chapter_number" bigint [not null]
  "difficulty" text [not null, note: 'easy, normal, hard']
  "title" text [not null]
  "is_active" boolean [not null]
}

Table "public"."user_ap_wrong_answer" {
  "id" uuid [pk, not null]
  "ap_result_id" uuid [not null]
  "ap_question_id" uuid [not null]
}

Table "public"."sat_test_spr" {
  "id" uuid [pk, not null]
  "question_id" uuid [not null]
  "answer" decimal
}

Table "public"."ap_exam_choice" {
  "id" uuid [pk, not null]
  "question_id" uuid [not null, ref: < "public"."ap_exam_question"."id"]
  "is_answer" boolean [not null]
  "choice_text" text
  "image_url" text
}

Table "public"."announcement" {
  "id" uuid [pk, not null]
  "announced_by" uuid [not null]
  "notification" text [not null]
  "urgency" text [not null, note: 'low, medium, high']
  "category" text [not null, note: 'ap, sat']
  "created_at" timestamp
  "updated_at" timestamp
  "deleted_at" timestamp
}

Table "public"."user_sat_test" {
  "id" uuid [pk, not null]
  "sat_id" uuid [not null]
  "user_service_id" uuid [not null, ref: < "public"."user_service"."id"]
  "is_active" boolean [not null]
}
