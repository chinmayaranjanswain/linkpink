// LINKPINK — Auth Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { useAuthStore } from '../src/stores/authStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../src/constants/theme';

type AuthStep = 'welcome' | 'email' | 'otp';

export default function AuthScreen() {
  const { signInWithOTP, verifyOTP, signInWithApple, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState<AuthStep>('welcome');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    await signInWithOTP(email);
    setStep('otp');
  };

  const handleOTPSubmit = async () => {
    if (otp.length < 6) return;
    await verifyOTP(email, otp);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.logoMark}>
            <Image source={require('../assets/images/LINKPINK.jpeg')} style={styles.logoImage} />
          </View>
          <Text style={styles.logoText}>LINKPINK</Text>
          <Text style={styles.tagline}>Your AI-powered internet memory</Text>
        </View>

        {step === 'welcome' && (
          <View style={styles.authOptions}>
            {/* Social Auth */}
            <TouchableOpacity style={styles.socialBtn} onPress={() => {}}>
              <Feather name="chrome" size={20} color={COLORS.text} />
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.socialBtn} onPress={signInWithApple}>
                <Feather name="smartphone" size={20} color={COLORS.text} />
                <Text style={styles.socialText}>Continue with Apple</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.socialBtn} onPress={() => {}}>
              <Feather name="github" size={20} color={COLORS.text} />
              <Text style={styles.socialText}>Continue with GitHub</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email */}
            <Button
              title="Continue with Email"
              onPress={() => setStep('email')}
              variant="primary"
              fullWidth
            />
          </View>
        )}

        {step === 'email' && (
          <View style={styles.authOptions}>
            <Input
              value={email}
              onChangeText={(text) => { setEmail(text); clearError(); }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              label="Email"
              error={error || undefined}
              icon={<Feather name="mail" size={18} color={COLORS.dim} />}
            />
            <Button
              title="Send Code"
              onPress={handleEmailSubmit}
              isLoading={isLoading}
              disabled={!email.trim()}
              fullWidth
            />
            <TouchableOpacity onPress={() => setStep('welcome')}>
              <Text style={styles.backText}>← Back to options</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'otp' && (
          <View style={styles.authOptions}>
            <Text style={styles.otpInfo}>
              We sent a 6-digit code to{'\n'}
              <Text style={styles.otpEmail}>{email}</Text>
            </Text>
            <Input
              value={otp}
              onChangeText={(text) => { setOtp(text); clearError(); }}
              placeholder="Enter 6-digit code"
              keyboardType="numeric"
              label="Verification Code"
              error={error || undefined}
            />
            <Button
              title="Verify"
              onPress={handleOTPSubmit}
              isLoading={isLoading}
              disabled={otp.length < 6}
              fullWidth
            />
            <TouchableOpacity onPress={() => setStep('email')}>
              <Text style={styles.backText}>← Change email</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
  },

  // Logo
  logoArea: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FONT_SIZE.base,
    color: COLORS.sub,
    marginTop: SPACING.xs,
  },

  // Auth Options
  authOptions: {
    gap: SPACING.md,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.dim,
  },

  // OTP
  otpInfo: {
    fontSize: FONT_SIZE.base,
    color: COLORS.sub,
    textAlign: 'center',
    lineHeight: 22,
  },
  otpEmail: {
    color: COLORS.text,
    fontWeight: FONT_WEIGHT.semibold,
  },

  backText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.accent,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },

  footer: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.dim,
    textAlign: 'center',
    marginTop: 48,
    lineHeight: 16,
  },
});
