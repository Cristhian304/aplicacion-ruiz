import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  ScrollView, StatusBar, Switch 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function AjustesScreen({ navigation }) {
  const [autoTranslate, setAutoTranslate] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffc163" />
      
      <ScrollView style={styles.scrollContainer}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Ajustes</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traducción</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="translate" size={24} color="#000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Traducción Automática</Text>
                <Text style={styles.settingDescription}>
                  Traducir automáticamente los pasos de preparación al español
                </Text>
              </View>
            </View>
            <Switch
              value={autoTranslate}
              onValueChange={setAutoTranslate}
            />
          </View>

          <Text style={styles.settingNote}>
            Los ingredientes y nombres siempre se traducen automáticamente
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffc163' },
  scrollContainer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  placeholder: { width: 40 },
  section: { backgroundColor: 'rgba(255,255,255,0.3)', margin: 20, borderRadius: 15, padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 15 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingTexts: { marginLeft: 15, flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  settingDescription: { fontSize: 12, color: '#666', marginTop: 2 },
  settingNote: { fontSize: 12, color: '#666', fontStyle: 'italic', marginTop: 10 },
});