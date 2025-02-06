# ShakeBeat 🎵  
**ShakeBeat** is a fun and interactive virtual percussion instrument app that allows users to **shake their phone to create beats**! With customizable sound effects and engaging visual feedback, ShakeBeat offers an exciting way to turn your phone into a musical instrument.

---

## Features 🚀  
### 1. **Shake Detection**  
- Detects phone shaking using the **Accelerometer sensor**.
- Displays **"SHAKE"** in bold letters when the user shakes the phone.

### 2. **Customizable Sound Effects**  
- Users can cycle through various percussion sounds like drums, cymbals, and tambourines.  
- Displays the selected sound type on the screen.

### 3. **Visual Feedback**  
- Optional color-changing backgrounds or ripple animations when the phone is shaken.

### 4. **Shake Counter (Gamification)**  
- Tracks the number of shakes and displays the count on the screen.

---

## How It Works 🛠️  
1. **Shake Detection:**  
   - The app uses the **Accelerometer** to detect shaking motion by monitoring significant changes in `x`, `y`, or `z` values above a threshold (e.g., `1.5g`).  
   - The shaking triggers a sound and displays "SHAKE" on the screen.

2. **Custom Sounds:**  
   - A button allows users to switch between different percussion sounds.
   - The current sound type is displayed on the screen for easy selection.

3. **Sound Playback:**  
   - The app plays percussion sounds using the `expo-av` library for smooth audio playback.

4. **Visual Feedback:**  
   - Adds a dynamic and engaging visual element to enhance the user experience.

---
![ShakeBeat App Screenshot](https://github.com/user-attachments/assets/7205db6e-8753-4cbf-9da6-779589fb4769)


## Code Example 💻  

Below is a simplified implementation of ShakeBeat:

```javascript
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Vibration } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState(null);
  const [currentSound, setCurrentSound] = useState(require('./sounds/drum.wav'));
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      if (Math.abs(x) > 1.5 || Math.abs(y) > 1.5 || Math.abs(z) > 1.5) {
        handleShake();
      } else {
        setIsShaking(false);
      }
    });

    return () => subscription.remove();
  }, []);

  const handleShake = async () => {
    if (!isShaking) {
      setIsShaking(true);
      Vibration.vibrate(100);
      try {
        const { sound } = await Audio.Sound.createAsync(currentSound);
        setSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
