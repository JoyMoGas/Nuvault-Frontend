import React from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Logo from '../assets/logo-text.svg';

export default function WelcomeScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const contentHeight = screenHeight * 0.5;

  return (
    <View style={{ flex: 1, backgroundColor: '#2E2E2E' }}>
      {/* Imagen de fondo */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          alignItems: 'center',
          zIndex: 0,
        }}
      >
        <Image
          source={require('../assets/image.png')}
          style={{
            width: screenWidth * 0.8,
            height: screenWidth * 1.7,
            resizeMode: 'contain',
            marginTop: 120,
          }}
        />
      </View>

      {/* Logo encima de la imagen */}
      <View style={{ alignItems: 'center', marginTop: 70, zIndex: 2 }}>
        <Logo width={200} height={60} />
      </View>

      {/* Contenedor negro sólido para contenido */}
      <View
        style={{
          position: 'absolute',
          bottom: -50, // lo bajamos
          height: contentHeight,
          width: '100%',
          backgroundColor: '#2E2E2E',
          zIndex: 1,
        }}
      >
        {/* Sombra difuminada hacia arriba */}
        <LinearGradient
          colors={['rgba(46,46,46,0)', 'rgba(46,46,46,1)']}
          style={{
            position: 'absolute',
            bottom: contentHeight - 1,
            height: 280,
            width: '100%',
            zIndex: 1,
          }}
        />
      </View>

      {/* Contenido dentro del cuadro negro */}
      <View
        style={{
          position: 'absolute',
          bottom: -50, // también lo bajamos igual que el fondo
          height: contentHeight,
          width: '100%',
          paddingHorizontal: 24,
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <View className='mb-6'>
          <Text
            style={{
              color: 'white',
              fontSize: 36,
              fontWeight: 'bold',
              textAlign: 'left',
              marginBottom: 6,
              lineHeight: 42,
            }}
          >
            Manage all your{'\n'}passwords in one{'\n'}safe place.
          </Text>

          <Text
            style={{
              color: '#ccc',
              fontSize: 18,
              textAlign: 'left',
              lineHeight: 25,
            }}
          >
            Your digital vault to store, organize and protect your credentials—anytime, anywhere.
          </Text>
        </View>
        

        <View className='mb-10'>
          <Pressable
            onPress={() => router.push('/register')}
            style={{
              backgroundColor: '#FACC15',
              paddingVertical: 12,
              borderRadius: 16,
              marginBottom: 15
            }}
          >
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'center',
              }}
            >
              Get Started
            </Text>
          </Pressable>

          <Text
            style={{
              color: '#ccc',
              textAlign: 'center',
              fontSize: 15,
              marginBottom: 16,
            }}
          >
            Already Have An Account?{' '}
            <Text
              onPress={() => router.push('/login')}
              style={{
                color: '#FACC15',
                fontWeight: '600',
              }}
            >
              Log In
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
