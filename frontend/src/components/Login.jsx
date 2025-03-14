import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!email || !password) {
      setIsSubmitting(false);
      return;
    }
    
    const success = await login(email, password);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4} align="flex-start">
        <Heading>Login</Heading>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </VStack>
        </form>
        
        <Text>
          Don't have an account? <Link to="/register">Register</Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
