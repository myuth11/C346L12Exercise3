import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Vibration } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState(null);
  const [currentSound, setCurrentSound] = useState(require('./sounds/drum.wav'));
  const [isShaking, setIsShaking] = useState(false);

  // Start Accelerometer
  useEffect(() => {
    Accelerometer.setUpdateInterval(100); // 100ms interval
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      if (Math.abs(x) > 1.5 || Math.abs(y) > 1.5 || Math.abs(z) > 1.5) {
        handleShake();
      } else {
        setIsShaking(false);
      }
    });

    return () => subscription.remove();
  }, []);

  // Play sound on shake
  const handleShake = async () => {
    if (!isShaking) {
      setIsShaking(true);
      Vibration.vibrate(100); // Vibrate for feedback
      try {
        const { sound } = await Audio.Sound.createAsync(currentSound);
        setSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  // Cleanup sound
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Change sound effect
  const changeSound = () => {
    const sounds = [
      require('./sounds/drum.wav'),
      require('./sounds/cymbal.wav'),
      require('./sounds/tambourine.wav'),
    ];
    const nextSound = sounds[(sounds.indexOf(currentSound) + 1) % sounds.length];
    setCurrentSound(nextSound);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>{isShaking ? 'SHAKE!' : ''}</Text>
        <Button title="Change Sound" onPress={changeSound} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FF5722',
  },
});
