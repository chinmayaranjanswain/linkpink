// LINKPINK — Home Screen V3 (Bigger Rail + Skeleton + FAB Fix)

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
  Animated, Platform, ActivityIndicator, Modal, TextInput, Image, Pressable,
  Alert, Share, Linking,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getColors, useThemeStore, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT,
  SHADOWS, CATEGORIES, SOURCE_CONFIG,
} from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';

const { width: SW } = Dimensions.get('window');
const RAIL_W = 68;

// Mock data
const INITIAL_SAVES = [
  { id:'y1', title:'Build & Deploy Full Stack App', source:'youtube', type:'video', category:'coding', time:'1h', summary:'Complete full-stack deployment tutorial', url:'https://www.youtube.com/watch?v=MxNcCV1mXQw', thumbnail:'https://img.youtube.com/vi/MxNcCV1mXQw/hqdefault.jpg', pinned:false },
  { id:'y2', title:'JavaScript Crash Course 2026', source:'youtube', type:'video', category:'coding', time:'3h', summary:'Modern JavaScript from zero to hero', url:'https://youtu.be/1sl8UOFGHbo', thumbnail:'https://img.youtube.com/vi/1sl8UOFGHbo/hqdefault.jpg', pinned:false },
  { id:'y3', title:'React Native Full Course', source:'youtube', type:'video', category:'coding', time:'5h', summary:'Build mobile apps with React Native & Expo', url:'https://youtu.be/2tfZZOe9WGk', thumbnail:'https://img.youtube.com/vi/2tfZZOe9WGk/hqdefault.jpg', pinned:false },
  { id:'y4', title:'Next.js 15 — Complete Tutorial', source:'youtube', type:'video', category:'coding', time:'8h', summary:'Server components, app router, and deployment', url:'https://youtu.be/i6_KRb2AlAU', thumbnail:'https://img.youtube.com/vi/i6_KRb2AlAU/hqdefault.jpg', pinned:false },
  { id:'1', title:'Building AI Agents with LangChain', source:'youtube', type:'video', category:'ai', time:'2h', summary:'AI agents tutorial covering ReAct pattern and tool usage', thumbnail:'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', pinned:false },
  { id:'2', title:'System Design: Notification Service', source:'github', type:'link', category:'coding', time:'5h', summary:'Architecture deep-dive into push notification systems', pinned:false },
  { id:'3', title:'React 19 — What Actually Changed', source:'twitter', type:'thread', category:'coding', time:'8h', summary:'Thread summary of React 19 breaking changes', pinned:false },
  { id:'4', title:'How YC Founders Spend Their Time', source:'instagram', type:'reel', category:'startups', time:'1d', summary:'Startup reel breakdown of founder schedules', pinned:false },
  { id:'5', title:'Calculus III Integration Cheat Sheet', source:'pdf', type:'pdf', category:'study', time:'3d', summary:'Guide to multivariable calculus integration', pinned:false },
  { id:'6', title:'Figma Auto-Layout Mastery', source:'youtube', type:'video', category:'design', time:'4h', summary:'Advanced auto-layout and components walkthrough', thumbnail:'https://img.youtube.com/vi/5IanQIwhA4E/hqdefault.jpg', pinned:false },
  { id:'7', title:'DeFi Yield Farming 2026', source:'medium', type:'article', category:'finance', time:'6h', summary:'Current yield farming opportunities analysis', pinned:false },
  { id:'8', title:'GPT-5 Architecture Leak', source:'reddit', type:'thread', category:'ai', time:'12h', summary:'Community analysis of rumored GPT-5 changes', pinned:false },
  { id:'9', title:'Rust for Backend: Complete Guide', source:'web', type:'article', category:'coding', time:'2d', summary:'Building production services in Rust', pinned:false },
  { id:'10', title:'Mindful Morning Routine', source:'tiktok', type:'video', category:'health', time:'5d', summary:'Science-backed morning routine for focus', pinned:false },
];

const SUGGESTIONS = INITIAL_SAVES.filter(s => ['video','reel'].includes(s.type)).slice(0,4);

// Skeleton shimmer component
function Skeleton({ width, height, style }: any) {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = shimmer.interpolate({ inputRange: [0,1], outputRange: [0.3, 0.7] });
  return <Animated.View style={[{ width, height, borderRadius: 8, backgroundColor: '#333' }, style, { opacity }]} />;
}

function SkeletonFeed() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Skeleton width="100%" height={180} style={{ borderRadius: 16 }} />
      <Skeleton width="40%" height={14} />
      {[1,2,3].map(i => (
        <View key={i} style={{ flexDirection:'row', gap:12, padding:12 }}>
          <Skeleton width={40} height={40} style={{ borderRadius: 10 }} />
          <View style={{ flex:1, gap:6 }}>
            <Skeleton width="80%" height={14} />
            <Skeleton width="60%" height={10} />
            <Skeleton width="40%" height={10} />
          </View>
        </View>
      ))}
    </View>
  );
}

const ICON_OPTIONS = ['gamepad','music','camera','flask','file-text','globe','zap','microscope','target','cpu','bar-chart-2','trending-up','bulb','film','smartphone','tool','activity','coffee','navigation','headphones'] as const;
const COLOR_OPTIONS = ['#E74C3C','#9B59B6','#1ABC9C','#E67E22','#2ECC71','#3498DB','#E91E63','#795548'];

export default function HomeScreen() {
  const { mode } = useThemeStore();
  const C = getColors(mode);
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sugIdx, setSugIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saves, setSaves] = useState(INITIAL_SAVES);
  const [customCats, setCustomCats] = useState<{id:string;icon:string;label:string;color:string;bannerUri?:string}[]>([]);

  // Action menu state
  const [actionSave, setActionSave] = useState<typeof INITIAL_SAVES[0]|null>(null);
  const [showActions, setShowActions] = useState(false);
  const [toast, setToast] = useState('');

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('gamepad');
  const [newColor, setNewColor] = useState('#E74C3C');

  // Rename state
  const [renaming, setRenaming] = useState(false);
  const [renameText, setRenameText] = useState('');

  // Quick Save state
  const [showQuickSave, setShowQuickSave] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [saveCategory, setSaveCategory] = useState('all');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const detectSource = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('github.com')) return 'github';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('reddit.com')) return 'reddit';
    if (url.includes('medium.com')) return 'medium';
    if (url.endsWith('.pdf')) return 'pdf';
    return 'web';
  };

  const extractYouTubeId = (url: string): string|null => {
    const m = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 1800); };

  // ═══ SAVE ACTIONS ═══
  const deleteSave = (id: string) => {
    Alert.alert('Delete Save', 'Remove this save permanently?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setSaves(p => p.filter(s => s.id !== id));
        setShowActions(false);
        showToast('Save deleted');
      }},
    ]);
  };

  const copyLink = async (url?: string) => {
    if (!url) { showToast('No URL'); return; }
    await Clipboard.setStringAsync(url);
    setShowActions(false);
    showToast('Link copied!');
  };

  const shareLink = async (title: string, url?: string) => {
    if (!url) return;
    try { await Share.share({ message: `${title}\n${url}` }); } catch {}
    setShowActions(false);
  };

  const togglePin = (id: string) => {
    setSaves(p => p.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s));
    setShowActions(false);
    showToast('Pin toggled');
  };

  const openInBrowser = (url?: string) => {
    if (url) Linking.openURL(url);
    setShowActions(false);
  };

  const deleteCategory = (catId: string) => {
    if (catId.startsWith('custom_')) {
      Alert.alert('Delete Category', 'Remove this category?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setCustomCats(p => p.filter(c => c.id !== catId));
          setActiveCategory('all');
          showToast('Category deleted');
        }},
      ]);
    }
  };

  // ═══ QUICK SAVE (actually adds to state) ═══
  const handleQuickSave = async () => {
    if (!linkInput.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    const source = detectSource(linkInput);
    const ytId = extractYouTubeId(linkInput);
    const newSave = {
      id: `qs_${Date.now()}`,
      title: ytId ? 'YouTube Video' : linkInput.split('/').pop() || 'Saved Link',
      source,
      type: source === 'youtube' ? 'video' : 'link',
      category: saveCategory === 'all' ? 'coding' : saveCategory,
      time: 'now',
      summary: linkInput,
      url: linkInput,
      thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : undefined,
      pinned: false,
    };
    setSaves(p => [newSave, ...p]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowQuickSave(false); setLinkInput(''); setSaveCategory('all'); }, 1200);
  };

  const allCats = [...CATEGORIES, ...customCats];
  const activeCat = allCats.find(c => c.id === activeCategory);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setSugIdx(p => (p+1) % SUGGESTIONS.length), 5000);
    return () => clearInterval(iv);
  }, []);

  const sorted = [...saves].sort((a,b) => (b.pinned?1:0) - (a.pinned?1:0));
  const filtered = activeCategory === 'all' ? sorted : sorted.filter(s => s.category === activeCategory);
  const sug = SUGGESTIONS[sugIdx];
  const srcColor = (s: string) => SOURCE_CONFIG[s]?.color || C.accent;

  const openCreateModal = () => {
    setNewName('');
    setNewIcon('gamepad');
    setNewColor(COLOR_OPTIONS[customCats.length % COLOR_OPTIONS.length]);
    setShowCreate(true);
  };

  const confirmCreate = () => {
    if (!newName.trim()) return;
    const id = `custom_${Date.now()}`;
    setCustomCats(prev => [...prev, { id, icon: newIcon, label: newName.trim(), color: newColor }]);
    setShowCreate(false);
    setActiveCategory(id);
  };

  const startRename = () => {
    if (activeCategory === 'all') return; // can't rename All
    setRenameText(activeCat?.label || '');
    setRenaming(true);
  };

  const confirmRename = () => {
    if (!renameText.trim()) { setRenaming(false); return; }
    setCustomCats(prev => prev.map(c => c.id === activeCategory ? { ...c, label: renameText.trim() } : c));
    setRenaming(false);
  };

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      {/* VERTICAL RAIL */}
      <View style={[styles.rail, { backgroundColor: C.rail, borderRightColor: C.border }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.railScroll}>
          {/* Logo */}
          <TouchableOpacity style={styles.railLogo} onPress={() => setActiveCategory('all')}>
            <Image source={require('../../assets/images/LINKPINK.jpeg')} style={styles.logoImg} />
          </TouchableOpacity>
          <View style={[styles.railDiv, { backgroundColor: C.border }]} />

          {/* Categories */}
          {allCats.map(cat => {
            const active = activeCategory === cat.id;
            const iconName = (cat as any).icon || 'folder';
            return (
              <TouchableOpacity key={cat.id} onPress={() => setActiveCategory(cat.id)} onLongPress={() => deleteCategory(cat.id)} activeOpacity={0.8}>
                {active && <View style={[styles.railPip, { backgroundColor: cat.color }]} />}
                <LinearGradient
                  colors={active ? [cat.color, cat.color] : ['#7C3AED', '#A855F7', '#C084FC', '#D8B4FE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.railRing, { borderRadius: active ? 16 : 26, opacity: active ? 1 : 0.6 }]}
                >
                  <View style={[
                    styles.railBtnInner,
                    { backgroundColor: active ? cat.color : C.elevated,
                      borderRadius: active ? 13 : 23 },
                  ]}>
                    <Feather name={iconName as any} size={20} color={active ? '#FFF' : C.sub} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {/* Add custom */}
          <TouchableOpacity
            onPress={openCreateModal}
            style={[styles.railBtn, { backgroundColor: C.elevated, borderRadius: 24, borderWidth:1.5, borderColor: C.border, borderStyle:'dashed' }]}
          >
            <Feather name="plus" size={20} color={C.success} />
          </TouchableOpacity>

          <View style={{ flex: 1, minHeight: 20 }} />

          {/* Settings */}
          <TouchableOpacity
            style={[styles.railBtn, { backgroundColor: C.elevated }]}
            onPress={() => router.push('/profile')}
          >
            <Feather name="settings" size={18} color={C.dim} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MAIN CONTENT */}
      <View style={{ flex: 1 }}>
        {/* Header — shows active category */}
        <View style={[styles.header, { borderBottomColor: C.border }]}>
          <View style={{ flex:1, flexDirection:'row', alignItems:'center', gap:10 }}>
            {activeCat && (
              <View style={[styles.headerIcon, { backgroundColor: `${activeCat.color}20` }]}>
                <Feather name={(activeCat as any).icon || 'layers'} size={18} color={activeCat.color} />
              </View>
            )}
            {renaming ? (
              <TextInput
                style={[styles.headerTitle, { color: C.text, borderBottomWidth:2, borderBottomColor: C.accent, paddingBottom:2, minWidth:100 }]}
                value={renameText}
                onChangeText={setRenameText}
                onBlur={confirmRename}
                onSubmitEditing={confirmRename}
                autoFocus
                selectTextOnFocus
              />
            ) : (
              <TouchableOpacity onPress={startRename} activeOpacity={0.7}>
                <Text style={[styles.headerTitle, { color: C.text }]}>
                  {activeCategory === 'all' ? 'All Saves' : activeCat?.label || 'Saves'}
                </Text>
                {activeCategory !== 'all' && (
                  <View style={{ flexDirection:'row', alignItems:'center', gap:4, marginTop:1 }}>
                    <Feather name="edit-2" size={10} color={C.dim} />
                    <Text style={{ color: C.dim, fontSize:10 }}>Tap to rename</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            <Text style={[styles.headerSub, { color: C.dim, marginLeft: 4 }]}>
              · {filtered.length} saves
            </Text>
          </View>
          <View style={styles.headerBtns}>
            <TouchableOpacity style={[styles.hBtn, { backgroundColor: C.elevated }]} onPress={() => router.push('/search')}>
              <Feather name="search" size={17} color={C.sub} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.hBtn, { backgroundColor: C.elevated }]}>
              <Feather name="bell" size={17} color={C.sub} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.avatar, { backgroundColor: C.accent }]} onPress={() => router.push('/profile')}>
              <Text style={styles.avatarT}>{(user?.username||'C')[0].toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PROFESSIONAL CATEGORY COVER — only when specific category selected */}
        {activeCategory !== 'all' && activeCat && !loading && (
          <View style={styles.coverWrap}>
            {(activeCat as any).bannerUri ? (
              <Image source={{ uri: (activeCat as any).bannerUri }} style={styles.coverImg} />
            ) : (
              <LinearGradient
                colors={[`${activeCat.color}55`, `${activeCat.color}20`, C.bg]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.coverImg}
              />
            )}
            <LinearGradient colors={['transparent', `${C.bg}99`, C.bg]} style={styles.coverOverlay} />
            {/* Cover content */}
            <View style={styles.coverContent}>
              <View style={[styles.coverIconWrap, { backgroundColor: `${activeCat.color}25`, borderColor: `${activeCat.color}40` }]}>
                <Feather name={(activeCat as any).icon || 'folder'} size={28} color={activeCat.color} />
              </View>
              <Text style={[styles.coverTitle, { color: C.text }]}>{activeCat.label}</Text>
              <View style={styles.coverMeta}>
                <View style={[styles.coverBadge, { backgroundColor: `${activeCat.color}20` }]}>
                  <Text style={[styles.coverBadgeT, { color: activeCat.color }]}>{filtered.length} items</Text>
                </View>
                <TouchableOpacity style={[styles.coverEditBtn, { borderColor: C.border }]}>
                  <Feather name="image" size={12} color={C.sub} />
                  <Text style={{ color: C.sub, fontSize:10, fontWeight:'500' }}>Edit Cover</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {loading ? <SkeletonFeed /> : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
            {/* SUGGESTION HERO — only in All Saves */}
            {activeCategory === 'all' && (
            <View style={{ padding: SPACING.lg, paddingBottom: SPACING.sm }}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => sug.url && require('react-native').Linking.openURL(sug.url)}
                style={[styles.sugCard, { backgroundColor: C.elevated }]}
              >
                {sug.thumbnail ? (
                  <Image source={{ uri: sug.thumbnail }} style={styles.sugThumb} resizeMode="cover" />
                ) : null}
                <View style={styles.sugGrad}>
                  <View style={styles.sugYtBadge}>
                    <FontAwesome5 name="youtube" size={14} color="#FF0000" />
                  </View>
                  <View style={styles.sugPlayBtn}>
                    <Feather name="play" size={22} color="#FFF" />
                  </View>
                </View>
                <View style={styles.dots}>
                  {SUGGESTIONS.map((_,i) => (
                    <View key={i} style={[styles.dot, { backgroundColor: i===sugIdx ? C.accent : C.dim, width: i===sugIdx ? 16 : 5 }]} />
                  ))}
                </View>
              </TouchableOpacity>
            </View>
            )}

            {/* Section label */}
            <View style={styles.secHead}>
              <View style={styles.secLeft}>
                <View style={[styles.secDot, { backgroundColor: allCats.find(c=>c.id===activeCategory)?.color || C.accent }]} />
                <Text style={[styles.secTitle, { color: C.text }]}>
                  {activeCategory === 'all' ? 'Recent Saves' : allCats.find(c=>c.id===activeCategory)?.label}
                </Text>
              </View>
              <Text style={[styles.secCount, { color: C.dim }]}>{filtered.length}</Text>
            </View>

            {/* SAVE CARDS — Premium Minimal */}
            {filtered.map(save => {
              const source = save.source;
              const sColor = srcColor(source);
              const brandIcons: Record<string, string> = {
                youtube: 'youtube', github: 'github', instagram: 'instagram',
                twitter: 'twitter', reddit: 'reddit-alien', tiktok: 'tiktok',
                medium: 'medium-m', web: 'globe', pdf: 'file-pdf',
              };
              const brandIcon = brandIcons[source] || 'link';
              return (
                <TouchableOpacity
                  key={save.id} activeOpacity={0.8}
                  onPress={() => router.push({ pathname:'/save-detail', params:{ saveId: save.id } })}
                  onLongPress={() => { setActionSave(save); setShowActions(true); }}
                  style={[styles.saveItem, { backgroundColor: C.card, borderColor: save.pinned ? `${C.accent}40` : C.border }]}
                >
                  {save.pinned && (
                    <View style={[styles.pinBadge, { backgroundColor: `${C.accent}15` }]}>
                      <Feather name="star" size={9} color={C.accent} />
                      <Text style={{ color: C.accent, fontSize:9, fontWeight:'600' }}>PINNED</Text>
                    </View>
                  )}
                  <View style={styles.saveBody}>
                    {/* Thumbnail or Brand Logo */}
                    {save.thumbnail ? (
                      <View style={[styles.saveIcon, { overflow:'hidden', borderWidth:0 }]}>
                        <Image source={{ uri: save.thumbnail }} style={{ width:44, height:44, borderRadius:12 }} />
                        <View style={styles.savePlayBadge}>
                          <Feather name="play" size={8} color="#FFF" />
                        </View>
                      </View>
                    ) : (
                      <View style={[styles.saveIcon, { backgroundColor: `${sColor}12`, borderColor: `${sColor}25`, borderWidth: 1 }]}>
                        <FontAwesome5 name={brandIcon} size={20} color={sColor} />
                      </View>
                    )}
                    <View style={{ flex:1, gap:4 }}>
                      <Text style={[styles.saveTitle, { color: C.text }]} numberOfLines={2}>{save.title}</Text>
                      <Text style={{ color: C.sub, fontSize:12, lineHeight:16 }} numberOfLines={1}>{save.summary}</Text>
                      <View style={styles.saveMeta}>
                        <Text style={[styles.saveSrc, { color: sColor }]}>{SOURCE_CONFIG[source]?.label||'Web'}</Text>
                        <View style={{ width:3, height:3, borderRadius:2, backgroundColor: C.muted }} />
                        <Text style={{ color: C.dim, fontSize:10 }}>{save.time}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ padding: 4 }} onPress={() => { setActionSave(save); setShowActions(true); }}>
                      <Feather name="more-vertical" size={16} color={C.dim} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}

            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Feather name={(allCats.find(c=>c.id===activeCategory) as any)?.icon||'folder'} size={36} color={C.dim} />
                <Text style={[styles.emptyT, { color: C.sub }]}>No saves here yet</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* FAB - opens Quick Save sheet */}
        <TouchableOpacity
          style={[styles.fab, SHADOWS.accent]}
          onPress={() => { setShowQuickSave(true); setSaved(false); }}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#A855F7','#C084FC']} style={styles.fabInner}>
            <Feather name="plus" size={22} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* CREATE CATEGORY MODAL */}
      <Modal visible={showCreate} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setShowCreate(false)}>
          <Pressable style={[styles.modalBox, { backgroundColor: C.surface }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalH, { color: C.text }]}>New Category</Text>

            {/* Selected icon preview */}
            <View style={[styles.emojiPreview, { backgroundColor: `${newColor}22` }]}>
              <Feather name={newIcon as any} size={32} color={newColor} />
            </View>

            {/* Icon picker grid */}
            <Text style={[styles.modalLabel, { color: C.dim }]}>CHOOSE ICON</Text>
            <View style={styles.emojiGrid}>
              {ICON_OPTIONS.map(ic => (
                <TouchableOpacity
                  key={ic}
                  onPress={() => setNewIcon(ic)}
                  style={[styles.emojiOpt, ic === newIcon && { backgroundColor: `${newColor}30`, borderColor: newColor, borderWidth:2 }]}
                >
                  <Feather name={ic as any} size={18} color={ic === newIcon ? newColor : C.sub} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Color picker */}
            <Text style={[styles.modalLabel, { color: C.dim }]}>COLOR</Text>
            <View style={styles.colorRow}>
              {COLOR_OPTIONS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setNewColor(c)}
                  style={[styles.colorDot, { backgroundColor: c }, c === newColor && { borderWidth:3, borderColor: C.text }]}
                />
              ))}
            </View>

            {/* Name input */}
            <Text style={[styles.modalLabel, { color: C.dim }]}>NAME</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: C.elevated, borderColor: C.border, color: C.text }]}
              placeholder="Category name..."
              placeholderTextColor={C.dim}
              value={newName}
              onChangeText={setNewName}
              maxLength={20}
            />

            {/* Buttons */}
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: C.elevated }]} onPress={() => setShowCreate(false)}>
                <Text style={{ color: C.sub, fontWeight:'600', fontSize:14 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: newName.trim() ? C.accent : C.muted }]} onPress={confirmCreate}>
                <Text style={{ color: '#FFF', fontWeight:'600', fontSize:14 }}>Create</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* QUICK SAVE BOTTOM SHEET */}
      <Modal visible={showQuickSave} transparent animationType="slide">
        <TouchableOpacity style={styles.qsBg} onPress={() => setShowQuickSave(false)} activeOpacity={1}>
          <View style={[styles.qsSheet, { backgroundColor: C.surface }]} onStartShouldSetResponder={() => true}>
            {/* Handle */}
            <View style={[styles.qsHandle, { backgroundColor: C.border }]} />

            {saved ? (
              <View style={styles.qsSuccess}>
                <View style={[styles.qsCheckCircle, { backgroundColor: `${C.success}20` }]}>
                  <Feather name="check" size={28} color={C.success} />
                </View>
                <Text style={[styles.qsSuccessT, { color: C.text }]}>Saved!</Text>
                <Text style={{ color: C.sub, fontSize: 13 }}>Link added to your memory</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.qsTitle, { color: C.text }]}>Quick Save</Text>
                <Text style={{ color: C.sub, fontSize: 13, marginBottom: 12 }}>Paste any link to save it instantly</Text>

                {/* Link input */}
                <View style={[styles.qsInputWrap, { backgroundColor: C.elevated, borderColor: linkInput ? C.accent : C.border }]}>
                  <Feather name="link" size={16} color={linkInput ? C.accent : C.dim} />
                  <TextInput
                    style={[styles.qsInput, { color: C.text }]}
                    placeholder="Paste link here..."
                    placeholderTextColor={C.dim}
                    value={linkInput}
                    onChangeText={setLinkInput}
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {linkInput.length > 0 && (
                    <TouchableOpacity onPress={() => setLinkInput('')}>
                      <Feather name="x" size={16} color={C.dim} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Auto-detected source */}
                {linkInput.length > 5 && (
                  <View style={styles.qsDetected}>
                    <View style={[styles.qsDetectedBadge, { backgroundColor: `${srcColor(detectSource(linkInput))}18` }]}>
                      <Feather name={SOURCE_CONFIG[detectSource(linkInput)]?.icon as any || 'globe'} size={12} color={srcColor(detectSource(linkInput))} />
                      <Text style={{ color: srcColor(detectSource(linkInput)), fontSize: 11, fontWeight: '600' }}>
                        {SOURCE_CONFIG[detectSource(linkInput)]?.label || 'Web'}
                      </Text>
                    </View>
                    <Text style={{ color: C.dim, fontSize: 10 }}>Auto-detected</Text>
                  </View>
                )}

                {/* Category chips */}
                <Text style={[styles.qsCatLabel, { color: C.dim }]}>SAVE TO</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={styles.qsCatRow}>
                    {allCats.slice(0, 8).map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setSaveCategory(cat.id)}
                        style={[styles.qsCatChip, {
                          backgroundColor: saveCategory === cat.id ? `${cat.color}25` : C.elevated,
                          borderColor: saveCategory === cat.id ? cat.color : C.border,
                        }]}
                      >
                        <Feather name={(cat as any).icon || 'folder'} size={13} color={saveCategory === cat.id ? cat.color : C.dim} />
                        <Text style={{ color: saveCategory === cat.id ? cat.color : C.sub, fontSize: 11, fontWeight: '500' }}>{cat.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Save button */}
                <TouchableOpacity
                  style={[styles.qsSaveBtn, { opacity: linkInput.trim() ? 1 : 0.4 }]}
                  onPress={handleQuickSave}
                  disabled={!linkInput.trim() || saving}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#A855F7','#C084FC']} style={styles.qsSaveBtnInner}>
                    {saving ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <>
                        <Feather name="bookmark" size={16} color="#FFF" />
                        <Text style={styles.qsSaveBtnT}>Save Link</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* SAVE ACTION MENU */}
      <Modal visible={showActions} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setShowActions(false)}>
          <Pressable style={[styles.actionSheet, { backgroundColor: C.surface }]} onPress={e => e.stopPropagation()}>
            <View style={[styles.qsHandle, { backgroundColor: C.border, alignSelf:'center', marginBottom:12 }]} />
            {actionSave && (
              <>
                <Text style={[styles.actionTitle, { color: C.text }]} numberOfLines={1}>{actionSave.title}</Text>
                <Text style={{ color: C.dim, fontSize:11, marginBottom:12 }}>{actionSave.url || actionSave.summary}</Text>

                <TouchableOpacity style={[styles.actionRow, { borderColor: C.border }]} onPress={() => copyLink(actionSave.url)}>
                  <Feather name="copy" size={18} color={C.accent} />
                  <Text style={[styles.actionRowT, { color: C.text }]}>Copy Link</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionRow, { borderColor: C.border }]} onPress={() => shareLink(actionSave.title, actionSave.url)}>
                  <Feather name="share-2" size={18} color={C.accent} />
                  <Text style={[styles.actionRowT, { color: C.text }]}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionRow, { borderColor: C.border }]} onPress={() => togglePin(actionSave.id)}>
                  <Feather name="star" size={18} color={actionSave.pinned ? '#F59E0B' : C.sub} />
                  <Text style={[styles.actionRowT, { color: C.text }]}>{actionSave.pinned ? 'Unpin' : 'Pin to Top'}</Text>
                </TouchableOpacity>

                {actionSave.url && (
                  <TouchableOpacity style={[styles.actionRow, { borderColor: C.border }]} onPress={() => openInBrowser(actionSave.url)}>
                    <Feather name="external-link" size={18} color={C.sub} />
                    <Text style={[styles.actionRowT, { color: C.text }]}>Open in Browser</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={[styles.actionRow, { borderColor: 'transparent' }]} onPress={() => deleteSave(actionSave.id)}>
                  <Feather name="trash-2" size={18} color="#EF4444" />
                  <Text style={[styles.actionRowT, { color: '#EF4444' }]}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* TOAST */}
      {toast !== '' && (
        <View style={styles.toastWrap}>
          <View style={[styles.toastBox, { backgroundColor: C.elevated }]}>
            <Feather name="check-circle" size={14} color="#10B981" />
            <Text style={{ color: C.text, fontSize:13, fontWeight:'500' }}>{toast}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex:1, flexDirection:'row', paddingTop: Platform.OS==='ios' ? 50 : 30 },

  // Rail
  rail: { width: RAIL_W, borderRightWidth:1 },
  railScroll: { alignItems:'center', paddingTop:SPACING.md, paddingBottom:SPACING.xl, gap:8 },
  railLogo: { width:48, height:48, borderRadius:16, overflow:'hidden' },
  logoImg: { width:48, height:48, borderRadius:16 },
  railDiv: { width:32, height:2, borderRadius:1, marginVertical:4 },
  railBtn: { width:48, height:48, borderRadius:24, alignItems:'center', justifyContent:'center', position:'relative' },
  railRing: { width:52, height:52, padding:2.5, alignItems:'center', justifyContent:'center' },
  railBtnInner: { width:46, height:46, alignItems:'center', justifyContent:'center' },
  railPip: { position:'absolute', left:-10, top:15, width:4, height:22, borderRadius:2 },

  // Header
  header: { flexDirection:'row', alignItems:'center', paddingHorizontal:SPACING.lg, paddingVertical:SPACING.md, borderBottomWidth:1 },
  headerTitle: { fontSize:FONT_SIZE.xxl, fontWeight:FONT_WEIGHT.bold },
  headerSub: { fontSize:11, marginTop:1 },
  headerBtns: { flexDirection:'row', alignItems:'center', gap:8 },
  hBtn: { width:34, height:34, borderRadius:17, alignItems:'center', justifyContent:'center' },
  avatar: { width:32, height:32, borderRadius:16, alignItems:'center', justifyContent:'center' },
  avatarT: { color:'#FFF', fontSize:14, fontWeight:'700' },
  headerIcon: { width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center' },

  // Professional Category Cover
  coverWrap: { height:140, position:'relative', overflow:'hidden' },
  coverImg: { position:'absolute', top:0, left:0, right:0, bottom:0 },
  coverOverlay: { position:'absolute', bottom:0, left:0, right:0, height:90 },
  coverContent: { position:'absolute', bottom:12, left:0, right:0, alignItems:'center', gap:6 },
  coverIconWrap: { width:52, height:52, borderRadius:14, alignItems:'center', justifyContent:'center', borderWidth:1.5 },
  coverTitle: { fontSize:18, fontWeight:'800', letterSpacing:0.3 },
  coverMeta: { flexDirection:'row', alignItems:'center', gap:8 },
  coverBadge: { paddingHorizontal:10, paddingVertical:3, borderRadius:99 },
  coverBadgeT: { fontSize:11, fontWeight:'600' },
  coverEditBtn: { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:8, paddingVertical:3, borderRadius:99, borderWidth:1 },

  // Suggestion
  sugCard: { borderRadius:RADIUS.xl, overflow:'hidden', position:'relative' },
  sugThumb: { position:'absolute', top:0, left:0, right:0, bottom:0, width:'100%', height:'100%' },
  sugGrad: { aspectRatio:16/9, padding:SPACING.md, position:'relative' },
  sugYtBadge: { position:'absolute', top:12, left:12, backgroundColor:'rgba(0,0,0,0.55)', paddingHorizontal:8, paddingVertical:5, borderRadius:8 },
  sugPlayBtn: { position:'absolute', right:16, top:'50%', marginTop:-24, width:48, height:48, borderRadius:24, backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:'rgba(255,255,255,0.3)' },
  dots: { flexDirection:'row', justifyContent:'center', alignItems:'center', paddingVertical:8, gap:4 },
  dot: { height:5, borderRadius:3 },

  // Section
  secHead: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:SPACING.lg, paddingVertical:SPACING.md },
  secLeft: { flexDirection:'row', alignItems:'center', gap:8 },
  secDot: { width:8, height:8, borderRadius:4 },
  secTitle: { fontSize:FONT_SIZE.sm, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.5 },
  secCount: { fontSize:FONT_SIZE.sm },

  // Save item — Premium Minimal
  saveItem: { marginHorizontal:SPACING.lg, marginBottom:10, borderRadius:16, overflow:'hidden', borderWidth:1 },
  saveBody: { flex:1, flexDirection:'row', padding:14, gap:14, alignItems:'flex-start' },
  saveIcon: { width:44, height:44, borderRadius:12, alignItems:'center', justifyContent:'center', position:'relative' },
  savePlayBadge: { position:'absolute', bottom:2, right:2, width:16, height:16, borderRadius:8, backgroundColor:'rgba(0,0,0,0.7)', alignItems:'center', justifyContent:'center' },
  saveMeta: { flexDirection:'row', alignItems:'center', gap:6 },
  saveSrc: { fontSize:11, fontWeight:'600' },
  saveTitle: { fontSize:15, fontWeight:'600', lineHeight:20 },

  // Empty
  empty: { alignItems:'center', paddingVertical:60, gap:8 },
  emptyT: { fontSize:15, fontWeight:'500' },

  // FAB
  fab: { position:'absolute', bottom:16, right:14, borderRadius:99, zIndex:10 },
  fabInner: { width:50, height:50, borderRadius:25, alignItems:'center', justifyContent:'center' },

  // Quick Save Sheet
  qsBg: { flex:1, backgroundColor:'rgba(0,0,0,.5)', justifyContent:'flex-end' },
  qsSheet: { borderTopLeftRadius:24, borderTopRightRadius:24, padding:20, paddingBottom: Platform.OS==='ios' ? 40 : 24 },
  qsHandle: { width:36, height:4, borderRadius:2, alignSelf:'center', marginBottom:16 },
  qsTitle: { fontSize:20, fontWeight:'700', marginBottom:2 },
  qsInputWrap: { flexDirection:'row', alignItems:'center', gap:10, height:48, borderRadius:14, borderWidth:1.5, paddingHorizontal:14, marginBottom:8 },
  qsInput: { flex:1, fontSize:15, height:48 },
  qsDetected: { flexDirection:'row', alignItems:'center', gap:8, marginBottom:12 },
  qsDetectedBadge: { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:8, paddingVertical:3, borderRadius:99 },
  qsCatLabel: { fontSize:10, fontWeight:'600', letterSpacing:0.8, marginBottom:8 },
  qsCatRow: { flexDirection:'row', gap:6 },
  qsCatChip: { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:6, borderRadius:99, borderWidth:1 },
  qsSaveBtn: { borderRadius:14, overflow:'hidden' },
  qsSaveBtnInner: { height:48, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, borderRadius:14 },
  qsSaveBtnT: { color:'#FFF', fontSize:15, fontWeight:'600' },
  qsSuccess: { alignItems:'center', paddingVertical:32, gap:8 },
  qsCheckCircle: { width:60, height:60, borderRadius:30, alignItems:'center', justifyContent:'center' },
  qsSuccessT: { fontSize:20, fontWeight:'700' },

  // Modal
  modalBg: { flex:1, backgroundColor:'rgba(0,0,0,.65)', justifyContent:'center', alignItems:'center' },
  modalBox: { width:'88%', borderRadius:20, padding:24, gap:16, maxHeight:'85%' },
  modalH: { fontSize:20, fontWeight:'700', textAlign:'center' },
  emojiPreview: { width:80, height:80, borderRadius:20, alignItems:'center', justifyContent:'center', alignSelf:'center' },
  modalLabel: { fontSize:10, fontWeight:'600', letterSpacing:0.8 },
  emojiGrid: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  emojiOpt: { width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  colorRow: { flexDirection:'row', gap:10 },
  colorDot: { width:28, height:28, borderRadius:14 },
  modalInput: { height:44, borderRadius:12, borderWidth:1, paddingHorizontal:16, fontSize:15 },
  modalBtns: { flexDirection:'row', gap:10 },
  modalBtn: { flex:1, height:44, borderRadius:12, alignItems:'center', justifyContent:'center' },

  // Pin Badge
  pinBadge: { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:3, borderBottomLeftRadius:0, borderBottomRightRadius:0, borderTopLeftRadius:16, borderTopRightRadius:16 },

  // Action Sheet
  actionSheet: { position:'absolute', bottom:0, left:0, right:0, borderTopLeftRadius:24, borderTopRightRadius:24, padding:20, paddingBottom: Platform.OS==='ios' ? 40 : 28 },
  actionTitle: { fontSize:16, fontWeight:'700', marginBottom:2 },
  actionRow: { flexDirection:'row', alignItems:'center', gap:14, paddingVertical:14, borderBottomWidth:1 },
  actionRowT: { fontSize:15, fontWeight:'500' },

  // Toast
  toastWrap: { position:'absolute', bottom:90, left:0, right:0, alignItems:'center', zIndex:999 },
  toastBox: { flexDirection:'row', alignItems:'center', gap:8, paddingHorizontal:16, paddingVertical:10, borderRadius:99, ...SHADOWS.card },
});
