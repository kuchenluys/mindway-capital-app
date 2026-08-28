import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

const CommunityScreen = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Juan García',
      content: 'Acabo de cerrar una posición en XAUUSD con +180 pips 🎉',
      likes: 245,
      comments: 12,
      timestamp: 'Hace 2h',
      liked: false,
    },
    {
      id: '2',
      author: 'María López',
      content: 'Completé el módulo 3 de Trading Avanzado! 📚',
      likes: 180,
      comments: 8,
      timestamp: 'Hace 4h',
      liked: false,
    },
  ]);

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>👥 Comunidad</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>1.2K</Text>
            <Text style={styles.statLabel}>Miembros</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>342</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
        </View>

        {/* New Post Input */}
        <View style={styles.newPostContainer}>
          <TextInput
            style={styles.input}
            placeholder="Comparte tu experiencia..."
            placeholderTextColor="#94a3b8"
            multiline
          />
          <TouchableOpacity style={styles.postBtn}>
            <Text style={styles.postBtnText}>Publicar</Text>
          </TouchableOpacity>
        </View>

        {/* Posts Feed */}
        <Text style={styles.sectionTitle}>Feed Reciente</Text>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View>
                <Text style={styles.author}>{post.author}</Text>
                <Text style={styles.timestamp}>{post.timestamp}</Text>
              </View>
            </View>

            <Text style={styles.content}>{post.content}</Text>

            <View style={styles.postFooter}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleLike(post.id)}
              >
                <Text style={[styles.actionIcon, post.liked && styles.liked]}>
                  {post.liked ? '❤️' : '🤍'}
                </Text>
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>📤</Text>
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
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  stat: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: { color: '#fbbf24', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { color: '#94a3b8', fontSize: 11 },
  newPostContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    color: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  postBtn: { backgroundColor: '#fbbf24', borderRadius: 8, padding: 12, alignItems: 'center' },
  postBtnText: { color: '#0f172a', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#e2e8f0', marginBottom: 12 },
  postCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  postHeader: { marginBottom: 12 },
  author: { color: '#e2e8f0', fontWeight: '600', fontSize: 14, marginBottom: 2 },
  timestamp: { color: '#94a3b8', fontSize: 11 },
  content: { color: '#e2e8f0', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-around', borderTopColor: '#334155', borderTopWidth: 1, paddingTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon: { fontSize: 16 },
  actionText: { color: '#94a3b8', fontSize: 12 },
  liked: { color: '#ef4444' },
});

export default CommunityScreen;
