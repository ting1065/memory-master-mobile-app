import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import PressableButton from "../components/PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addUserToDB } from "../Firebase/firebase-helper";
import Card from "../components/Card";
import { colors } from "../styles/colors";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import GradientBackground from "../components/GradientBackground";

export default function Signup({ navigation }) {
  //regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  async function signupHandler() {
    if (!emailRegex.test(email)) {
      Alert.alert("Please enter a valid email address");
      return;
    }

    if (password !== confirmedPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password should be at least 6 characters");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await addUserToDB(auth.currentUser.uid, auth.currentUser.email);
    } catch (error) {
      console.log("error happened while signing up:", error);
    }
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.appName}>Memory Master</Text>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeBigWrods}>Welcome!</Text>
          <Text style={styles.welcomesmallWrods}>Signup into your account</Text>
        </View>

        <Card width={300} height={460} backgroundColor={colors.whiteWords}>
          <AntDesign name="user" size={24} style={styles.user} />
          <Text style={styles.inputTitle}>Email</Text>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="email-outline" size={24} />
            </View>
            <TextInput
              autoCapitalize="none"
              placeholder="name@example.com"
              placeholderTextColor={colors.placeHolder}
              value={email}
              onChangeText={(newText) => setEmail(newText)}
              style={styles.textInput}
            />
          </View>
          <Text style={styles.inputTitle}>Password</Text>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="ios-lock-closed-outline" size={24} />
            </View>
            <TextInput
              autoCapitalize="none"
              placeholder="at least 6 characters"
              placeholderTextColor={colors.placeHolder}
              secureTextEntry={true}
              value={password}
              onChangeText={(newText) => setPassword(newText)}
              style={styles.textInput}
            />
          </View>
          <Text style={styles.inputTitle}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="ios-lock-closed-outline" size={24} />
            </View>
            <TextInput
              autoCapitalize="none"
              placeholder="enter your password again"
              placeholderTextColor={colors.placeHolder}
              secureTextEntry={true}
              value={confirmedPassword}
              onChangeText={(newText) => setConfirmedPassword(newText)}
              style={styles.textInput}
            />
          </View>

          <PressableButton
            defaultStyle={styles.defaultStyle}
            pressedStyle={styles.pressedStyle}
            onPress={() => signupHandler()}
          >
            <Text style={styles.loginButtonText}>Register</Text>
          </PressableButton>
        </Card>
        <View style={styles.bottomContainer}>
          <Text>Already Registered? </Text>
          <PressableButton
            pressedStyle={styles.pressedStyleBottom}
            onPress={() => navigation.replace("Login")}
          >
            <Text style={styles.createAccountText}>Login</Text>
          </PressableButton>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  welcomeContainer: {
    width: 300,
    alignSelf: "center",
    marginBottom: 40,
  },
  welcomeBigWrods: {
    fontSize: 30,
    color: colors.whiteWords,
  },
  welcomesmallWrods: {
    color: colors.whiteWords,
  },
  appName: {
    fontSize: 45,
    color: colors.appName,
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "Cochin" : "Roboto",
    fontWeight: "bold",
  },
  inputTitle: {
    fontSize: 20,
    marginVertical: 20,
  },
  textInput: {
    fontSize: 20,
    height: 40,
    width: "90%",
    paddingLeft: 5,
  },
  user: {
    marginTop: 10,
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
  },
  iconContainer: {
    marginHorizontal: 5,
    marginTop: 8,
  },
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: "center",
  },
  defaultStyle: {
    width: 200,
    height: 45,
    marginTop: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.loginButton,
    // Add platform-specific shadow
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  pressedStyle: {
    backgroundColor: colors.pressedLoginButton,
    opacity: 0.5,
  },
  bottomContainer: {
    marginTop: 30,
    flexDirection: "row",
  },
  pressedStyleBottom: {
    opacity: 0.2,
  },
  createAccountText: {
    color: colors.redWords,
  },
});
