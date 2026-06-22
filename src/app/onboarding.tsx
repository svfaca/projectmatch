import {
    AppButton,
    BrandMark,
    StepIndicator,
    SurfaceCard,
    palette,
} from "@/components/ui/projectmatch-ui";
import { ROLE_STORAGE_KEY } from "@/constants/storage";
import { auth } from "@/services/firebase";
import { getSessionSnapshot } from "@/services/session";
import { getUserProfile, saveOnboardingData } from "@/services/users";
import type { ExperienceLevel, UserType } from "@/types/user";
import {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetTextInput,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Role = "creator" | "builder";
type SheetKind = "university" | "course";

const USER_TYPE_OPTIONS: Array<{
  value: UserType;
  emoji: string;
  label: string;
  description: string;
}> = [
  {
    value: "student",
    emoji: "🎓",
    label: "Aluno",
    description: "Estuda e quer conectar formacao com projetos reais.",
  },
  {
    value: "teacher",
    emoji: "👨‍🏫",
    label: "Professor",
    description: "Ensina, orienta ou atua em instituicoes de ensino.",
  },
  {
    value: "professional",
    emoji: "💼",
    label: "Profissional",
    description: "Ja atua no mercado e quer colaborar com projetos.",
  },
  {
    value: "founder",
    emoji: "🚀",
    label: "Empreendedor",
    description: "Tem uma iniciativa propria ou quer tirar uma ideia do papel.",
  },
  {
    value: "enthusiast",
    emoji: "🔍",
    label: "Entusiasta",
    description: "Gosta de tecnologia e quer explorar areas de interesse.",
  },
];

const UNIVERSITY_OPTIONS = [
  "UNIFESO",
  "UFRJ",
  "UFF",
  "UERJ",
  "PUC-Rio",
  "UNIRIO",
  "USP",
  "UNICAMP",
  "UFMG",
];

const COURSE_OPTIONS = [
  "Ciencia da Computacao",
  "Sistemas de Informacao",
  "Engenharia de Software",
  "Design",
  "Administracao",
  "Marketing",
  "Direito",
  "Medicina",
  "Enfermagem",
];

const SKILL_OPTIONS = [
  "React",
  "React Native",
  "TypeScript",
  "Python",
  "FastAPI",
  "Node.js",
  "UI Design",
  "Figma",
  "Marketing",
  "Power BI",
  "Data Science",
];

const INTEREST_OPTIONS = [
  "Startups",
  "Produto",
  "Mobile",
  "Web",
  "IA",
  "Dados",
  "Comunidade",
  "Open Source",
  "Design",
  "Negocios",
];

const AVAILABILITY_OPTIONS = [
  "5h/semana",
  "10h/semana",
  "20h/semana",
  "30h+/semana",
];

const EXPERIENCE_OPTIONS: Array<{ value: ExperienceLevel; label: string }> = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediario" },
  { value: "advanced", label: "Avancado" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Pleno" },
  { value: "senior", label: "Senior" },
];

const BIO_LIMIT = 200;

export default function OnboardingScreen() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const [userType, setUserType] = useState<UserType | null>(null);
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [institution, setInstitution] = useState("");
  const [professionArea, setProfessionArea] = useState("");
  const [professionTitle, setProfessionTitle] = useState("");
  const [founderMainArea, setFounderMainArea] = useState("");
  const [founderHasProject, setFounderHasProject] = useState<boolean | null>(
    null,
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);
  const [saving, setSaving] = useState(false);

  const [activeSheet, setActiveSheet] = useState<SheetKind | null>(null);
  const [sheetSearch, setSheetSearch] = useState("");
  const pickerSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    AsyncStorage.getItem(ROLE_STORAGE_KEY).then((value) => {
      const nextRole =
        value === "creator" || value === "builder" ? value : null;
      setRole(nextRole);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || !role) {
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      return;
    }

    let active = true;

    getUserProfile(user.uid)
      .then((profile) => {
        if (!active || !profile) {
          return;
        }

        setUserType(profile.userType ?? null);
        setUniversity(profile.university ?? "");
        setCourse(profile.course ?? "");
        setInstitution(profile.institution ?? "");
        setProfessionArea(profile.professionArea ?? "");
        setProfessionTitle(profile.professionTitle ?? "");
        setFounderMainArea(profile.founderMainArea ?? "");
        setFounderHasProject(profile.founderHasProject ?? null);
        setSkills(Array.isArray(profile.skills) ? profile.skills : []);
        setInterests(Array.isArray(profile.interests) ? profile.interests : []);
        setBio(profile.bio ?? "");
        setAvailability(profile.availability ?? null);
        setExperienceLevel(profile.experienceLevel ?? null);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
  }, [loading, role]);

  const sheetOptions = useMemo(
    () => (activeSheet === "university" ? UNIVERSITY_OPTIONS : COURSE_OPTIONS),
    [activeSheet],
  );

  const filteredSheetOptions = useMemo(() => {
    const normalized = sheetSearch.trim().toLowerCase();

    return sheetOptions.filter((item) =>
      item.toLowerCase().includes(normalized),
    );
  }, [sheetOptions, sheetSearch]);

  const requiredFieldsComplete = useMemo(() => {
    if (!userType || !availability || !experienceLevel) {
      return false;
    }

    switch (userType) {
      case "student":
        return university.trim().length > 0 && course.trim().length > 0;
      case "teacher":
        return (
          institution.trim().length > 0 && professionArea.trim().length > 0
        );
      case "professional":
        return (
          professionArea.trim().length > 0 && professionTitle.trim().length > 0
        );
      case "founder":
        return founderMainArea.trim().length > 0 && founderHasProject !== null;
      case "enthusiast":
        return interests.length > 0;
      default:
        return false;
    }
  }, [
    availability,
    course,
    experienceLevel,
    founderHasProject,
    founderMainArea,
    institution,
    interests.length,
    professionArea,
    professionTitle,
    university,
    userType,
  ]);

  function openPickerSheet(kind: SheetKind) {
    setActiveSheet(kind);
    setSheetSearch("");
    pickerSheetRef.current?.present();
  }

  function closePickerSheet() {
    pickerSheetRef.current?.dismiss();
    setActiveSheet(null);
    setSheetSearch("");
  }

  function selectSheetValue(value: string) {
    if (activeSheet === "university") {
      setUniversity(value);
    }

    if (activeSheet === "course") {
      setCourse(value);
    }

    closePickerSheet();
  }

  async function handleSubmit() {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuario nao autenticado.");
      return;
    }

    if (!role) {
      Alert.alert("Erro", "Escolha uma role para continuar.");
      return;
    }

    if (!userType || !availability || !experienceLevel) {
      Alert.alert(
        "Perfil incompleto",
        "Selecione tipo de perfil, disponibilidade e nivel de experiencia.",
      );
      return;
    }

    if (!requiredFieldsComplete) {
      Alert.alert(
        "Campos pendentes",
        "Preencha os campos obrigatorios do seu tipo de perfil.",
      );
      return;
    }

    setSaving(true);

    try {
      const payload = buildOnboardingPayload({
        userType,
        university,
        course,
        institution,
        professionArea,
        professionTitle,
        founderMainArea,
        founderHasProject,
        skills,
        interests,
        bio,
        availability,
        experienceLevel,
      });

      await saveOnboardingData(user.uid, {
        ...payload,
        role,
        onboardingCompleted: true,
      });

      const session = await getSessionSnapshot(user.uid);
      console.log("SESSION AFTER SAVE", JSON.stringify(session, null, 2));

      router.replace(role === "creator" ? "/creator" : "/builder");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel salvar os dados de onboarding.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.shell}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Carregando onboarding...</Text>
        </View>
      </View>
    );
  }

  if (!role) {
    return (
      <View style={styles.shell}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
        <View style={styles.rolePicker}>
          <BrandMark compact />
          <Text style={styles.roleTitle}>Como deseja usar o ProjectMatch?</Text>
          <Text style={styles.roleSubtitle}>
            Escolha o papel principal para personalizar a experiencia.
          </Text>
          <AppButton
            title="Sou Criador - tenho uma ideia de projeto"
            onPress={async () => {
              await AsyncStorage.setItem(ROLE_STORAGE_KEY, "creator");
              setRole("creator");
            }}
          />
          <AppButton
            title="Sou Builder - quero contribuir com projetos"
            onPress={async () => {
              await AsyncStorage.setItem(ROLE_STORAGE_KEY, "builder");
              setRole("builder");
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.shell}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <ScrollView
          contentContainerStyle={styles.safeAreaContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <BrandMark compact />
            <Text style={styles.kicker}>Onboarding</Text>
            <Text style={styles.title}>Seu perfil, sem friccao.</Text>
            <Text style={styles.subtitle}>
              Agora o cadastro e condicional, com menos digitacao e mais
              qualidade de dados para matching.
            </Text>
          </View>

          <StepIndicator
            steps={["Role", "Perfil", "Detalhes", "Concluir"]}
            currentStep={userType ? 3 : 2}
          />

          <SurfaceCard style={styles.card}>
            <Text style={styles.sectionTitle}>Quem e voce?</Text>
            <Text style={styles.sectionSubtitle}>
              Selecione uma opcao para personalizar os proximos campos.
            </Text>
            <UserTypeGrid selected={userType} onSelect={setUserType} />

            {userType ? (
              <View style={styles.blockSpacing}>
                <Text style={styles.sectionTitle}>Informacoes do perfil</Text>
                <Text style={styles.sectionSubtitle}>
                  Campos inteligentes conforme seu tipo de usuario.
                </Text>

                {userType === "student" ? (
                  <View style={styles.fieldStack}>
                    <PickerField
                      label="Universidade"
                      placeholder="Selecione sua universidade"
                      value={university}
                      onPress={() => openPickerSheet("university")}
                    />
                    <PickerField
                      label="Curso"
                      placeholder="Selecione seu curso"
                      value={course}
                      onPress={() => openPickerSheet("course")}
                    />
                  </View>
                ) : null}

                {userType === "teacher" ? (
                  <View style={styles.fieldStack}>
                    <TextField
                      label="Instituicao"
                      value={institution}
                      onChangeText={setInstitution}
                      placeholder="Ex.: faculdade, colegio ou centro de pesquisa"
                    />
                    <TextField
                      label="Area de atuacao"
                      value={professionArea}
                      onChangeText={setProfessionArea}
                      placeholder="Ex.: IA, engenharia, educacao"
                    />
                  </View>
                ) : null}

                {userType === "professional" ? (
                  <View style={styles.fieldStack}>
                    <TextField
                      label="Area de atuacao"
                      value={professionArea}
                      onChangeText={setProfessionArea}
                      placeholder="Ex.: produto, engenharia, marketing"
                    />
                    <TextField
                      label="Cargo"
                      value={professionTitle}
                      onChangeText={setProfessionTitle}
                      placeholder="Ex.: Product Manager, Dev, Designer"
                    />
                  </View>
                ) : null}

                {userType === "founder" ? (
                  <View style={styles.fieldStack}>
                    <TextField
                      label="Area principal"
                      value={founderMainArea}
                      onChangeText={setFounderMainArea}
                      placeholder="Ex.: SaaS, educacao, fintech"
                    />
                    <View style={styles.toggleGroup}>
                      <Text style={styles.fieldLabel}>
                        Possui projeto atualmente?
                      </Text>
                      <View style={styles.toggleRow}>
                        <ToggleOption
                          label="Sim"
                          active={founderHasProject === true}
                          onPress={() => setFounderHasProject(true)}
                        />
                        <ToggleOption
                          label="Nao"
                          active={founderHasProject === false}
                          onPress={() => setFounderHasProject(false)}
                        />
                      </View>
                    </View>
                  </View>
                ) : null}

                {userType === "enthusiast" ? (
                  <ChipSelector
                    label="Areas de interesse"
                    placeholder="Buscar interesse"
                    options={INTEREST_OPTIONS}
                    selected={interests}
                    onChange={setInterests}
                  />
                ) : null}
              </View>
            ) : null}

            <View style={styles.blockSpacing}>
              <TextField
                label="Fale um pouco sobre voce"
                value={bio}
                onChangeText={(value) => setBio(value.slice(0, BIO_LIMIT))}
                placeholder="Ex.: Desenvolvedor focado em React Native e IA."
                multiline
              />
              <Text style={styles.helperText}>
                {bio.length}/{BIO_LIMIT}
              </Text>
            </View>

            <View style={styles.blockSpacing}>
              <SingleChoiceChips
                label="Disponibilidade"
                options={AVAILABILITY_OPTIONS}
                selected={availability}
                onSelect={setAvailability}
              />
            </View>

            <View style={styles.blockSpacing}>
              <SingleChoiceChips
                label="Nivel de experiencia"
                options={EXPERIENCE_OPTIONS.map((item) => item.label)}
                selected={
                  EXPERIENCE_OPTIONS.find(
                    (item) => item.value === experienceLevel,
                  )?.label ?? null
                }
                onSelect={(label) => {
                  const level = EXPERIENCE_OPTIONS.find(
                    (item) => item.label === label,
                  )?.value;
                  setExperienceLevel(level ?? null);
                }}
              />
            </View>

            <View style={styles.blockSpacing}>
              <ChipSelector
                label="Skills"
                placeholder="Buscar skill"
                options={SKILL_OPTIONS}
                selected={skills}
                onChange={setSkills}
                allowCustom
                helperText="Selecione ou adicione competencias em formato de chips."
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerHint}>
                {requiredFieldsComplete
                  ? "Pronto para concluir o onboarding."
                  : "Preencha os campos obrigatorios para continuar."}
              </Text>
              <AppButton
                title={saving ? "Salvando..." : "Continuar"}
                onPress={handleSubmit}
                disabled={saving || !requiredFieldsComplete}
              />
            </View>
          </SurfaceCard>
        </ScrollView>

        <SearchablePickerSheet
          sheetRef={pickerSheetRef}
          title={activeSheet === "university" ? "Universidade" : "Curso"}
          placeholder={
            activeSheet === "university"
              ? "Pesquisar universidade..."
              : "Pesquisar curso..."
          }
          options={filteredSheetOptions}
          query={sheetSearch}
          onQueryChange={setSheetSearch}
          onSelect={selectSheetValue}
          onDismiss={() => setActiveSheet(null)}
        />
      </View>
    </BottomSheetModalProvider>
  );
}

function buildOnboardingPayload(input: {
  userType: UserType;
  university: string;
  course: string;
  institution: string;
  professionArea: string;
  professionTitle: string;
  founderMainArea: string;
  founderHasProject: boolean | null;
  skills: string[];
  interests: string[];
  bio: string;
  availability: string;
  experienceLevel: ExperienceLevel;
}) {
  const base = {
    userType: input.userType,
    university: null as string | null,
    course: null as string | null,
    institution: null as string | null,
    professionArea: null as string | null,
    professionTitle: null as string | null,
    founderMainArea: null as string | null,
    founderHasProject: null as boolean | null,
    interests: [] as string[],
    skills: input.skills,
    bio: input.bio.trim() || null,
    availability: input.availability,
    experienceLevel: input.experienceLevel,
  };

  switch (input.userType) {
    case "student":
      return {
        ...base,
        university: input.university.trim() || null,
        course: input.course.trim() || null,
      };
    case "teacher":
      return {
        ...base,
        institution: input.institution.trim() || null,
        professionArea: input.professionArea.trim() || null,
      };
    case "professional":
      return {
        ...base,
        professionArea: input.professionArea.trim() || null,
        professionTitle: input.professionTitle.trim() || null,
      };
    case "founder":
      return {
        ...base,
        professionArea: input.founderMainArea.trim() || null,
        founderMainArea: input.founderMainArea.trim() || null,
        founderHasProject: input.founderHasProject,
      };
    case "enthusiast":
      return {
        ...base,
        interests: input.interests,
      };
    default:
      return base;
  }
}

function UserTypeGrid({
  selected,
  onSelect,
}: {
  selected: UserType | null;
  onSelect: (value: UserType) => void;
}) {
  return (
    <View style={styles.userTypeGrid}>
      {USER_TYPE_OPTIONS.map((option) => {
        const active = selected === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={({ pressed }) => [
              styles.userTypeCard,
              active && styles.userTypeCardActive,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.userTypeEmoji}>{option.emoji}</Text>
            <Text
              style={[
                styles.userTypeLabel,
                active && styles.userTypeLabelActive,
              ]}
            >
              {option.label}
            </Text>
            <Text style={styles.userTypeDescription}>{option.description}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PickerField({
  label,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pickerField, pressed && styles.pressed]}
      >
        <Text
          style={[styles.pickerFieldText, !value && styles.pickerPlaceholder]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Text style={styles.pickerChevron}>⌄</Text>
      </Pressable>
    </View>
  );
}

function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        style={[styles.textField, multiline && styles.multilineField]}
      />
    </View>
  );
}

function ToggleOption({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.toggleOption,
        active && styles.toggleOptionActive,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.toggleOptionText,
          active && styles.toggleOptionTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SingleChoiceChips({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {options.map((option) => {
          const active = selected === option;

          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.chipText, active && styles.chipTextSelected]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ChipSelector({
  label,
  placeholder,
  options,
  selected,
  onChange,
  helperText,
  allowCustom = false,
}: {
  label: string;
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  helperText?: string;
  allowCustom?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  const normalizedQuery = query.trim();
  const canAddCustom =
    allowCustom &&
    normalizedQuery.length > 0 &&
    !options.some(
      (option) => option.toLowerCase() === normalizedQuery.toLowerCase(),
    ) &&
    !selected.some(
      (option) => option.toLowerCase() === normalizedQuery.toLowerCase(),
    );

  function toggleItem(item: string) {
    if (selected.includes(item)) {
      onChange(selected.filter((current) => current !== item));
      return;
    }

    onChange([...selected, item]);
    setQuery("");
  }

  function addCustomItem() {
    if (!canAddCustom) {
      return;
    }

    onChange([...selected, normalizedQuery]);
    setQuery("");
  }

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          style={styles.searchField}
        />
        {canAddCustom ? (
          <Pressable
            onPress={addCustomItem}
            style={({ pressed }) => [
              styles.addChipButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.addChipButtonText}>Adicionar</Text>
          </Pressable>
        ) : null}
      </View>

      {selected.length > 0 ? (
        <View style={styles.chipWrap}>
          {selected.map((item) => (
            <Pressable
              key={item}
              onPress={() => toggleItem(item)}
              style={({ pressed }) => [
                styles.chip,
                styles.chipSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.chipTextSelected}>{item}</Text>
              <Text style={styles.chipRemove}>×</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.chipWrap}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((item) => {
            const active = selected.includes(item);

            return (
              <Pressable
                key={item}
                onPress={() => toggleItem(item)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextSelected]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <Text style={styles.emptyHint}>Nenhuma opcao encontrada.</Text>
        )}
      </View>

      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

function SearchablePickerSheet({
  sheetRef,
  title,
  placeholder,
  options,
  query,
  onQueryChange,
  onSelect,
  onDismiss,
}: {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  title: string;
  placeholder: string;
  options: string[];
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (value: string) => void;
  onDismiss: () => void;
}) {
  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={["78%"]}
      onDismiss={onDismiss}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetHandle}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView style={styles.sheetContent}>
        <Text style={styles.sheetTitle}>{title}</Text>
        <BottomSheetTextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          style={styles.sheetSearch}
        />
        <BottomSheetFlatList
          data={options}
          keyExtractor={(item) => item}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.sheetList}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
              style={({ pressed }) => [
                styles.sheetOption,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.sheetOptionText}>{item}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyHint}>Nenhum resultado encontrado.</Text>
          }
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#020617",
  },
  safeAreaContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
    gap: 18,
  },
  glowTop: {
    position: "absolute",
    right: -90,
    top: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(14, 165, 233, 0.14)",
  },
  glowBottom: {
    position: "absolute",
    left: -100,
    bottom: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(99, 102, 241, 0.18)",
  },
  header: {
    gap: 10,
    paddingTop: 8,
  },
  kicker: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "700",
  },
  rolePicker: {
    flex: 1,
    gap: 16,
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  roleTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.4,
  },
  roleSubtitle: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  card: {
    gap: 20,
    padding: 18,
    backgroundColor: "rgba(15, 23, 42, 0.84)",
    borderColor: "rgba(148, 163, 184, 0.18)",
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 19,
  },
  blockSpacing: {
    gap: 14,
  },
  userTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  userTypeCard: {
    width: "48%",
    gap: 8,
    padding: 14,
    borderRadius: 22,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.14)",
  },
  userTypeCardActive: {
    borderColor: palette.primary,
    backgroundColor: "rgba(99, 102, 241, 0.18)",
    shadowColor: palette.primary,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  userTypeEmoji: {
    fontSize: 24,
  },
  userTypeLabel: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "800",
  },
  userTypeLabelActive: {
    color: "#FFFFFF",
  },
  userTypeDescription: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 17,
  },
  fieldStack: {
    gap: 14,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "800",
  },
  textField: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(2, 6, 23, 0.78)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#F8FAFC",
    fontSize: 16,
  },
  multilineField: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  pickerField: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(2, 6, 23, 0.78)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pickerFieldText: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 16,
  },
  pickerPlaceholder: {
    color: "#64748B",
  },
  pickerChevron: {
    color: "#94A3B8",
    fontSize: 18,
    fontWeight: "700",
  },
  toggleGroup: {
    gap: 8,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  toggleOption: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(2, 6, 23, 0.78)",
  },
  toggleOptionActive: {
    borderColor: palette.primary,
    backgroundColor: "rgba(99, 102, 241, 0.18)",
  },
  toggleOptionText: {
    color: "#CBD5E1",
    fontSize: 15,
    fontWeight: "800",
  },
  toggleOptionTextActive: {
    color: "#FFFFFF",
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  searchField: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(2, 6, 23, 0.78)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#F8FAFC",
    fontSize: 16,
  },
  addChipButton: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.primary,
  },
  addChipButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(2, 6, 23, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  chipSelected: {
    borderColor: palette.primary,
    backgroundColor: "rgba(99, 102, 241, 0.18)",
  },
  chipText: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "700",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  chipRemove: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  helperText: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 16,
  },
  emptyHint: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    gap: 12,
    paddingTop: 4,
  },
  footerHint: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  sheetBackground: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.16)",
  },
  sheetHandle: {
    backgroundColor: "rgba(148, 163, 184, 0.38)",
  },
  sheetContent: {
    flex: 1,
    padding: 18,
    gap: 12,
  },
  sheetTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
  },
  sheetSearch: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(2, 6, 23, 0.78)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#F8FAFC",
    fontSize: 16,
  },
  sheetList: {
    gap: 10,
    paddingBottom: 24,
  },
  sheetOption: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    backgroundColor: "rgba(15, 23, 42, 0.88)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
  },
  sheetOptionText: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "700",
  },
});
