import { BottomNavigation } from "@/components/builder-home/BottomNavigation";
import { CategoryChip } from "@/components/builder-home/CategoryChip";
import { Header } from "@/components/builder-home/Header";
import { ProfileProgressCard } from "@/components/builder-home/ProfileProgressCard";
import { ProjectCard } from "@/components/builder-home/ProjectCard";
import { SearchBar } from "@/components/builder-home/SearchBar";
import { auth } from "@/services/firebase";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  "Todos",
  "💻 Tecnologia",
  "📊 Dados",
  "🎨 Design",
  "📚 Pesquisa",
  "🔬 IA",
  "📱 Mobile",
];

const recommendedProjects = [
  {
    title: "Sistema de Gestao Hospitalar",
    institution: "UNIFESO",
    stack: ["React", "Firebase", "TypeScript"],
    applicants: 12,
    slots: 5,
    category: "💻 Tecnologia",
  },
  {
    title: "App de Saude Universitaria",
    institution: "UFRJ",
    stack: ["Flutter", "Node", "Figma"],
    applicants: 7,
    slots: 2,
    category: "📱 Mobile",
  },
  {
    title: "Laboratorio de Visao Computacional",
    institution: "UFF",
    stack: ["Python", "OpenCV", "Dados"],
    applicants: 19,
    slots: 4,
    category: "🔬 IA",
  },
];

const recentProjects = [
  {
    title: "Plataforma EAD Interativa",
    institution: "UNIRIO",
    stack: ["React", "Node"],
    applicants: 6,
    slots: 3,
  },
  {
    title: "Sistema Academico Inteligente",
    institution: "UERJ",
    stack: ["Next", "Prisma"],
    applicants: 4,
    slots: 2,
  },
];

export default function BuilderDashboard() {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const userName = auth.currentUser?.displayName ?? "Savio";

  const filteredRecommendedProjects = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return recommendedProjects.filter((project) => {
      const matchesCategory =
        activeCategory === "Todos" || project.category === activeCategory;

      const matchesSearch =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        project.stack.some((item) => item.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchValue]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header name={userName} onAvatarPress={() => router.push("/profile")} />

        <SearchBar value={searchValue} onChangeText={setSearchValue} />

        <ProfileProgressCard
          progress={80}
          onPress={() => router.push("/profile")}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              {categories.map((category) => (
                <CategoryChip
                  key={category}
                  label={category}
                  selected={activeCategory === category}
                  onPress={() => setActiveCategory(category)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projetos Recomendados</Text>
          <View style={styles.listColumn}>
            {filteredRecommendedProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                institution={project.institution}
                stack={project.stack}
                applicants={project.applicants}
                slots={project.slots}
                onApply={() => router.push("/builder/swipe")}
              />
            ))}

            {filteredRecommendedProjects.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Nenhum projeto encontrado</Text>
                <Text style={styles.emptyText}>
                  Tente outra busca ou selecione uma categoria diferente.
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projetos Recentes</Text>
          <View style={styles.listColumn}>
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                institution={project.institution}
                stack={project.stack}
                applicants={project.applicants}
                slots={project.slots}
                onApply={() => router.push("/builder/swipe")}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <BottomNavigation
        items={[
          {
            key: "home",
            icon: "🏠",
            label: "Inicio",
            active: true,
            onPress: () => router.push("/builder"),
          },
          {
            key: "search",
            icon: "🔍",
            label: "Buscar",
            onPress: () => router.push("/builder/swipe"),
          },
          {
            key: "projects",
            icon: "📁",
            label: "Projetos",
            onPress: () => router.push("/builder/matches"),
          },
          {
            key: "alerts",
            icon: "🔔",
            label: "Alertas",
            onPress: () => router.push("/builder/matches"),
          },
          {
            key: "profile",
            icon: "👤",
            label: "Perfil",
            onPress: () => router.push("/profile"),
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 18,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 20,
  },
  listColumn: {
    gap: 12,
  },
  emptyCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    gap: 6,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 96,
  },
});
