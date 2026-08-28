import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';

interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
  students: number;
  price: number;
  enrolled: boolean;
}

const CoursesScreen = () => {
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Trading Avanzado',
      category: 'Trading',
      progress: 40,
      students: 1250,
      price: 99,
      enrolled: true,
    },
    {
      id: '2',
      title: 'Mindfulness Profundo',
      category: 'Desarrollo',
      progress: 37,
      students: 890,
      price: 49,
      enrolled: true,
    },
    {
      id: '3',
      title: 'Biohacking Completo',
      category: 'Salud',
      progress: 0,
      students: 650,
      price: 79,
      enrolled: false,
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📚 Cursos</Text>

        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Trading</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Desarrollo</Text>
          </TouchableOpacity>
        </View>

        {courses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <View>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseCategory}>{course.category}</Text>
              </View>
              <Text style={styles.coursePrice}>${course.price}</Text>
            </View>

            {course.enrolled && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${course.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{course.progress}%</Text>
              </View>
            )}

            <View style={styles.courseFooter}>
              <Text style={styles.students}>👥 {course.students}</Text>
              <TouchableOpacity
                style={[
                  styles.enrollBtn,
                  course.enrolled && styles.enrolledBtn,
                ]}
              >
                <Text
                  style={[
                    styles.enrollBtnText,
                    course.enrolled && styles.enrolledBtnText,
                  ]}
                >
                  {course.enrolled ? '✓ Inscrito' : 'Inscribirse'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fbbf24', marginBottom: 20 },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterText: { color: '#e2e8f0', fontSize: 12, fontWeight: '500' },
  courseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseTitle: { color: '#e2e8f0', fontWeight: '600', fontSize: 16, marginBottom: 4 },
  courseCategory: { color: '#94a3b8', fontSize: 12 },
  coursePrice: { color: '#22c55e', fontWeight: 'bold', fontSize: 18 },
  progressContainer: { marginBottom: 12 },
  progressBar: {
    height: 4,
    backgroundColor: '#0f172a',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 2 },
  progressText: { color: '#94a3b8', fontSize: 11 },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  students: { color: '#94a3b8', fontSize: 12 },
  enrollBtn: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  enrolledBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#22c55e' },
  enrollBtnText: { color: '#0f172a', fontWeight: '600', fontSize: 12 },
  enrolledBtnText: { color: '#22c55e' },
});

export default CoursesScreen;
