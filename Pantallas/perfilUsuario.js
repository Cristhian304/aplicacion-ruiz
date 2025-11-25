import React from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, Image, 
  ScrollView, StatusBar, Alert 
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function PerfilUsuario({ navigation }) {
  
  const userData = {
    name: "Ana García",
    email: "ana.garcia@email.com",
    memberSince: "Enero 2024",
    favorites: 8,
    translations: 23
  };

  const menuItems = [
    {
      id: 'menu-1',
      icon: <Ionicons name="settings-outline" size={24} color="#000" />,
      text: "Ajustes",
      onPress: () => navigation.navigate('AjustesScreen')
    },
    {
      id: 'menu-2',
      icon: <Feather name="clock" size={24} color="#000" />,
      text: "Historial", 
      onPress: () => navigation.navigate('Historial')
    },
    {
      id: 'menu-3',
      icon: <Ionicons name="heart-outline" size={24} color="#000" />,
      text: "Favoritos",
      onPress: () => console.log('Favoritos')
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Cerrar Sesión", 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'InicioSesion' }],
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffc163" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.profileTitle}>Mi Perfil</Text>
          
          <Image
            source={{ uri: 'https://thispersondoesnotexist.com/' }}
            style={styles.avatar}
          />
          
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.memberSince}>Miembro desde {userData.memberSince}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.favorites}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.translations}</Text>
            <Text style={styles.statLabel}>Traducciones</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuText}>{item.text}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#ff0033" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc163',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ff8c20ff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 30,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 10,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    color: '#000',
    marginLeft: 15,
    fontWeight: '500',
  },
  logoutContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  logoutText: {
    color: '#ff0033',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});