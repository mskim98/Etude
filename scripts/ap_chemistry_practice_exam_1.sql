-- AP Chemistry Practice Exam 1 데이터 생성 스크립트
-- 이 스크립트는 AP Chemistry Practice Exam 1에 대한 시험 문제와 선택지를 생성합니다.

-- 먼저 필요한 테이블들이 존재하는지 확인하고 데이터를 삽입합니다.

-- 0. 먼저 필요한 기본 데이터 생성 (service, ap, ap_exam)

-- Service 생성 (AP Chemistry 서비스)
INSERT INTO service (id, service_name, category, created_at, updated_at, created_by, updated_by) 
VALUES (
    'ap-chemistry-service-id', 
    'AP Chemistry', 
    'ap', 
    NOW(), 
    NOW(), 
    'system-admin-id', 
    'system-admin-id'
) ON CONFLICT (id) DO NOTHING;

-- AP Subject 생성
INSERT INTO ap (id, service_id, teacher_id, title, description, created_at, updated_at, created_by, updated_by) 
VALUES (
    'ap-chemistry-subject-id',
    'ap-chemistry-service-id',
    'system-admin-id',
    'AP Chemistry',
    'Advanced Placement Chemistry course',
    NOW(),
    NOW(),
    'system-admin-id',
    'system-admin-id'
) ON CONFLICT (id) DO NOTHING;

-- AP Exam 생성
INSERT INTO ap_exam (id, subject_id, title, description, duration, quantity, difficulty, is_active, created_at, updated_at, created_by, updated_by) 
VALUES (
    'ap-chem-practice-exam-1',
    'ap-chemistry-subject-id',
    'AP Chemistry Practice Exam 1',
    'Comprehensive practice exam covering all major topics in AP Chemistry including atomic structure, chemical bonding, thermodynamics, kinetics, equilibrium, and acids & bases.',
    195, -- 3시간 15분
    15,  -- 15문제
    'normal',
    true,
    NOW(),
    NOW(),
    'system-admin-id',
    'system-admin-id'
) ON CONFLICT (id) DO NOTHING;

-- 1. AP Chemistry Practice Exam 1 시험 문제 생성
-- 문제 1: Atomic Structure
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ap-chem-practice-exam-1', 1, 
'Which of the following statements about atomic orbitals is correct?', 
'Atomic orbitals are mathematical functions that describe the wave-like behavior of electrons in atoms. Each orbital can hold a maximum of two electrons with opposite spins.', 
'text', 'normal', 'Atomic Structure');

-- 문제 1 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'All orbitals have the same energy level', NULL, false, 1),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'The s orbital has a spherical shape', NULL, true, 2),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440001', 'Electrons can occupy any orbital without restriction', NULL, false, 3),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440001', 'Orbitals are physical paths that electrons follow', NULL, false, 4);

-- 문제 2: Chemical Bonding
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'ap-chem-practice-exam-1', 2, 
'What type of bond forms between sodium and chlorine in NaCl?', 
'Sodium chloride is a common ionic compound. When sodium and chlorine atoms interact, electrons are transferred from one atom to another.', 
'text', 'easy', 'Chemical Bonding');

-- 문제 2 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'Covalent bond', NULL, false, 1),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', 'Ionic bond', NULL, true, 2),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440002', 'Metallic bond', NULL, false, 3),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440002', 'Hydrogen bond', NULL, false, 4);

-- 문제 3: Thermodynamics
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'ap-chem-practice-exam-1', 3, 
'Which process has a positive ΔH (enthalpy change)?', 
'Enthalpy change (ΔH) is the heat absorbed or released during a chemical reaction at constant pressure. A positive ΔH indicates an endothermic process.', 
'text', 'normal', 'Thermodynamics');

-- 문제 3 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', 'Combustion of methane', NULL, false, 1),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', 'Formation of water from hydrogen and oxygen', NULL, false, 2),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440003', 'Dissolution of ammonium nitrate in water', NULL, true, 3),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440003', 'Freezing of water', NULL, false, 4);

-- 문제 4: Kinetics
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'ap-chem-practice-exam-1', 4, 
'How does increasing temperature affect the rate of a chemical reaction?', 
'Reaction kinetics studies the rate of chemical reactions and the factors that influence them. Temperature is one of the most important factors affecting reaction rates.', 
'text', 'normal', 'Kinetics');

-- 문제 4 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440004', 'It decreases the reaction rate', NULL, false, 1),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440004', 'It increases the reaction rate', NULL, true, 2),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440004', 'It has no effect on the reaction rate', NULL, false, 3),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440004', 'It stops the reaction completely', NULL, false, 4);

-- 문제 5: Equilibrium
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'ap-chem-practice-exam-1', 5, 
'What happens to the equilibrium position when the concentration of a reactant is increased?', 
'Le Chatelier''s principle states that when a system at equilibrium is subjected to a change in concentration, temperature, or pressure, the system will adjust to minimize the effect of the change.', 
'text', 'hard', 'Equilibrium');

-- 문제 5 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440005', 'Equilibrium shifts toward the products', NULL, true, 1),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440005', 'Equilibrium shifts toward the reactants', NULL, false, 2),
('550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440005', 'Equilibrium position remains unchanged', NULL, false, 3),
('550e8400-e29b-41d4-a716-446655440504', '550e8400-e29b-41d4-a716-446655440005', 'The reaction stops completely', NULL, false, 4);

-- 문제 6: Acids & Bases
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'ap-chem-practice-exam-1', 6, 
'According to the Brønsted-Lowry definition, an acid is:', 
'The Brønsted-Lowry theory defines acids and bases in terms of proton (H⁺) transfer. This definition is more general than the Arrhenius definition.', 
'text', 'normal', 'Acids & Bases');

-- 문제 6 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440006', 'A substance that produces H⁺ ions in water', NULL, false, 1),
('550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440006', 'A substance that accepts H⁺ ions', NULL, false, 2),
('550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440006', 'A substance that donates H⁺ ions', NULL, true, 3),
('550e8400-e29b-41d4-a716-446655440604', '550e8400-e29b-41d4-a716-446655440006', 'A substance that produces OH⁻ ions in water', NULL, false, 4);

-- 문제 7: Atomic Structure (Advanced)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440007', 'ap-chem-practice-exam-1', 7, 
'Which electron configuration represents an excited state?', 
'Electron configurations can represent ground states (lowest energy) or excited states (higher energy). In excited states, electrons occupy higher energy orbitals than in the ground state.', 
'text', 'hard', 'Atomic Structure');

-- 문제 7 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440007', '1s² 2s² 2p⁶ 3s¹', NULL, false, 1),
('550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440007', '1s² 2s² 2p⁵ 3s²', NULL, true, 2),
('550e8400-e29b-41d4-a716-446655440703', '550e8400-e29b-41d4-a716-446655440007', '1s² 2s² 2p⁶ 3s² 3p⁶', NULL, false, 3),
('550e8400-e29b-41d4-a716-446655440704', '550e8400-e29b-41d4-a716-446655440007', '1s² 2s² 2p⁶ 3s² 3p⁵', NULL, false, 4);

-- 문제 8: Chemical Bonding (Advanced)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440008', 'ap-chem-practice-exam-1', 8, 
'Which molecule has the strongest intermolecular forces?', 
'Intermolecular forces are the forces of attraction between molecules. The strength of these forces affects physical properties like boiling point and viscosity.', 
'text', 'normal', 'Chemical Bonding');

-- 문제 8 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440008', 'CH₄', NULL, false, 1),
('550e8400-e29b-41d4-a716-446655440802', '550e8400-e29b-41d4-a716-446655440008', 'H₂O', NULL, true, 2),
('550e8400-e29b-41d4-a716-446655440803', '550e8400-e29b-41d4-a716-446655440008', 'CO₂', NULL, false, 3),
('550e8400-e29b-41d4-a716-446655440804', '550e8400-e29b-41d4-a716-446655440008', 'N₂', NULL, false, 4);

-- 문제 9: Thermodynamics (Advanced)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'ap-chem-practice-exam-1', 9, 
'What is the relationship between ΔG, ΔH, and ΔS?', 
'The Gibbs free energy (ΔG) determines whether a reaction is spontaneous. It is related to enthalpy (ΔH) and entropy (ΔS) changes through the equation ΔG = ΔH - TΔS.', 
'text', 'hard', 'Thermodynamics');

-- 문제 9 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-446655440901', '550e8400-e29b-41d4-a716-446655440009', 'ΔG = ΔH + TΔS', NULL, false, 1),
('550e8400-e29b-41d4-a716-446655440902', '550e8400-e29b-41d4-a716-446655440009', 'ΔG = ΔH - TΔS', NULL, true, 2),
('550e8400-e29b-41d4-a716-446655440903', '550e8400-e29b-41d4-a716-446655440009', 'ΔG = ΔH × TΔS', NULL, false, 3),
('550e8400-e29b-41d4-a716-446655440904', '550e8400-e29b-41d4-a716-446655440009', 'ΔG = ΔH ÷ TΔS', NULL, false, 4);

-- 문제 10: Kinetics (Advanced)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'ap-chem-practice-exam-1', 10, 
'In a first-order reaction, what happens to the half-life when the initial concentration is doubled?', 
'For first-order reactions, the half-life is independent of the initial concentration. This is a characteristic property of first-order kinetics.', 
'text', 'hard', 'Kinetics');

-- 문제 10 선택지
INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-4466554401001', '550e8400-e29b-41d4-a716-446655440010', 'It doubles', NULL, false, 1),
('550e8400-e29b-41d4-a716-4466554401002', '550e8400-e29b-41d4-a716-446655440010', 'It halves', NULL, false, 2),
('550e8400-e29b-41d4-a716-4466554401003', '550e8400-e29b-41d4-a716-446655440010', 'It remains the same', NULL, true, 3),
('550e8400-e29b-41d4-a716-4466554401004', '550e8400-e29b-41d4-a716-446655440010', 'It becomes zero', NULL, false, 4);

-- 추가 문제들 (11-15)

-- 문제 11: Equilibrium (Advanced)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'ap-chem-practice-exam-1', 11, 
'For the reaction A + B ⇌ C + D, if Kc = 1.0 × 10⁻⁴, what can be said about the equilibrium?', 
'The equilibrium constant (Kc) indicates the extent to which a reaction proceeds. A small Kc value suggests that the reaction favors the reactants at equilibrium.', 
'text', 'normal', 'Equilibrium');

INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-4466554401101', '550e8400-e29b-41d4-a716-446655440011', 'The reaction strongly favors products', NULL, false, 1),
('550e8400-e29b-41d4-a716-4466554401102', '550e8400-e29b-41d4-a716-446655440011', 'The reaction strongly favors reactants', NULL, true, 2),
('550e8400-e29b-41d4-a716-4466554401103', '550e8400-e29b-41d4-a716-446655440011', 'The reaction is at equilibrium', NULL, false, 3),
('550e8400-e29b-41d4-a716-4466554401104', '550e8400-e29b-41d4-a716-446655440011', 'The reaction does not occur', NULL, false, 4);

-- 문제 12: Acids & Bases (Advanced)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440012', 'ap-chem-practice-exam-1', 12, 
'What is the pH of a 0.1 M solution of a strong acid?', 
'Strong acids completely dissociate in water, producing a high concentration of H⁺ ions. The pH is calculated using pH = -log[H⁺].', 
'text', 'normal', 'Acids & Bases');

INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-4466554401201', '550e8400-e29b-41d4-a716-446655440012', '1', NULL, true, 1),
('550e8400-e29b-41d4-a716-4466554401202', '550e8400-e29b-41d4-a716-446655440012', '7', NULL, false, 2),
('550e8400-e29b-41d4-a716-4466554401203', '550e8400-e29b-41d4-a716-446655440012', '13', NULL, false, 3),
('550e8400-e29b-41d4-a716-4466554401204', '550e8400-e29b-41d4-a716-446655440012', '14', NULL, false, 4);

-- 문제 13: Atomic Structure (Intermediate)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440013', 'ap-chem-practice-exam-1', 13, 
'Which element has the highest first ionization energy?', 
'Ionization energy is the energy required to remove an electron from an atom. It generally increases across a period and decreases down a group in the periodic table.', 
'text', 'normal', 'Atomic Structure');

INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-4466554401301', '550e8400-e29b-41d4-a716-446655440013', 'Li', NULL, false, 1),
('550e8400-e29b-41d4-a716-4466554401302', '550e8400-e29b-41d4-a716-446655440013', 'Be', NULL, false, 2),
('550e8400-e29b-41d4-a716-4466554401303', '550e8400-e29b-41d4-a716-446655440013', 'F', NULL, true, 3),
('550e8400-e29b-41d4-a716-4466554401304', '550e8400-e29b-41d4-a716-446655440013', 'Na', NULL, false, 4);

-- 문제 14: Chemical Bonding (Intermediate)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440014', 'ap-chem-practice-exam-1', 14, 
'What is the molecular geometry of H₂O?', 
'Molecular geometry is determined by the arrangement of atoms around a central atom. VSEPR theory is used to predict molecular shapes based on electron pair repulsion.', 
'text', 'normal', 'Chemical Bonding');

INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-4466554401401', '550e8400-e29b-41d4-a716-446655440014', 'Linear', NULL, false, 1),
('550e8400-e29b-41d4-a716-4466554401402', '550e8400-e29b-41d4-a716-446655440014', 'Tetrahedral', NULL, false, 2),
('550e8400-e29b-41d4-a716-4466554401403', '550e8400-e29b-41d4-a716-446655440014', 'Bent', NULL, true, 3),
('550e8400-e29b-41d4-a716-4466554401404', '550e8400-e29b-41d4-a716-446655440014', 'Trigonal planar', NULL, false, 4);

-- 문제 15: Thermodynamics (Intermediate)
INSERT INTO ap_exam_question (id, ap_exam_id, order_field, question, passage, choice_type, difficulty, topic) VALUES
('550e8400-e29b-41d4-a716-446655440015', 'ap-chem-practice-exam-1', 15, 
'Which process has the largest increase in entropy?', 
'Entropy (S) is a measure of disorder or randomness in a system. Processes that increase molecular disorder generally have positive entropy changes.', 
'text', 'normal', 'Thermodynamics');

INSERT INTO ap_exam_choice (id, question_id, choice_text, image_url, is_answer, order_field) VALUES
('550e8400-e29b-41d4-a716-4466554401501', '550e8400-e29b-41d4-a716-446655440015', 'H₂O(l) → H₂O(s)', NULL, false, 1),
('550e8400-e29b-41d4-a716-4466554401502', '550e8400-e29b-41d4-a716-446655440015', 'H₂O(l) → H₂O(g)', NULL, true, 2),
('550e8400-e29b-41d4-a716-4466554401503', '550e8400-e29b-41d4-a716-446655440015', 'CO₂(g) → CO₂(s)', NULL, false, 3),
('550e8400-e29b-41d4-a716-4466554401504', '550e8400-e29b-41d4-a716-446655440015', 'NaCl(s) → NaCl(aq)', NULL, false, 4);

-- 완료 메시지
SELECT 'AP Chemistry Practice Exam 1 문제 생성 완료!' as status;

-- 생성된 데이터 확인
SELECT 
    'Service' as table_name, 
    COUNT(*) as count 
FROM service 
WHERE service_name = 'AP Chemistry'
UNION ALL
SELECT 
    'AP Subject' as table_name, 
    COUNT(*) as count 
FROM ap 
WHERE title = 'AP Chemistry'
UNION ALL
SELECT 
    'AP Exam' as table_name, 
    COUNT(*) as count 
FROM ap_exam 
WHERE title = 'AP Chemistry Practice Exam 1'
UNION ALL
SELECT 
    'Questions' as table_name, 
    COUNT(*) as count 
FROM ap_exam_question 
WHERE ap_exam_id = 'ap-chem-practice-exam-1'
UNION ALL
SELECT 
    'Choices' as table_name, 
    COUNT(*) as count 
FROM ap_exam_choice 
WHERE question_id IN (
    SELECT id FROM ap_exam_question 
    WHERE ap_exam_id = 'ap-chem-practice-exam-1'
);
