import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import { Worker } from '../services/database';

interface AddWorkerFormProps {
  worker?: Worker;
  isEditing?: boolean;
}

const AddWorkerForm: React.FC<AddWorkerFormProps> = ({ worker, isEditing = false }) => {
  const navigation = useNavigation();
  const { addWorker, updateWorker } = useDatabaseContext();

  const [formData, setFormData] = useState({
    name: worker?.name || '',
    role: worker?.role || '',
    email: worker?.email || '',
    phone: worker?.phone || '',
    hourlyRate: worker?.hourlyRate?.toString() || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.hourlyRate && isNaN(Number(formData.hourlyRate))) {
      newErrors.hourlyRate = 'Hourly rate must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const workerData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
      };

      if (isEditing && worker?.id) {
        await updateWorker(worker.id, workerData);
        Alert.alert('Success', 'Worker updated successfully!');
      } else {
        await addWorker(workerData);
        Alert.alert('Success', 'Worker added successfully!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to ${isEditing ? 'update' : 'add'} worker. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {isEditing ? 'Edit Worker' : 'Add New Worker'}
          </Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter worker's full name"
              placeholderTextColor="#999"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Role Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Role *</Text>
            <TextInput
              style={[styles.input, errors.role && styles.inputError]}
              value={formData.role}
              onChangeText={(text) => setFormData({ ...formData, role: text })}
              placeholder="Enter job role/position"
              placeholderTextColor="#999"
            />
            {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Phone Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          {/* Hourly Rate Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Hourly Rate (FCFA)</Text>
            <TextInput
              style={[styles.input, errors.hourlyRate && styles.inputError]}
              value={formData.hourlyRate}
              onChangeText={(text) => setFormData({ ...formData, hourlyRate: text })}
              placeholder="Enter hourly rate"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.hourlyRate && <Text style={styles.errorText}>{errors.hourlyRate}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting 
                ? (isEditing ? 'Updating...' : 'Adding...') 
                : (isEditing ? 'Update Worker' : 'Add Worker')
              }
            </Text>
          </TouchableOpacity>

          {/* Required Fields Note */}
          <Text style={styles.requiredNote}>* Required fields</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#028831',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requiredNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default AddWorkerForm;
