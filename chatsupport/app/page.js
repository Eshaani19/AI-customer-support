"use client"
import { Box, Stack, Button, TextField, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Hi! I'm the FitFinder support assistant. How can I help you today?`
    }, 
  ])

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async() => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true)

    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, {role: 'user', content: message}]),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

   return (
    <Box
      width = "100vw"
      height = "100vh"
      display = "flex"
      flexDirection= "column"
      justifyContent= "center"
      alignItems= "center"
      bgcolor="rgba(var(--background-end-rgb), 0.5)"
    >
      <Stack 
        direction={'column'} 
        width = "500px" 
        height="700px" 
        border="2px solid var(--primary-color)" 
        borderRadius={8}
        p ={2} 
        spacing={3}
        bgcolor="white"
      >
        <Typography  variant="h6" align="center" color="var(--primary-color)" fontWeight="bold">
          FitFinder Support
        </Typography>
        <Stack 
          direction={'column'} 
          spacing={2} 
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          p={1}
          bgcolor="rgba(var(--background-start-rgb), 0.1)"
        >
        {
          messages.map((message, index) => {
            return(
            <Box
              key = {index}
              display = "flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box 
                bgcolor={
                  message.role === 'assistant' ? 'var(--primary-color)' : 'var(--secondary-color)'
                }
                color = "white"
                borderRadius={16}
                p = {2}
                maxWidth="75%"
              >
              {message.content}
              </Box>
            </Box>
            )
          })
        }
        <div ref={messagesEndRef} />
        </Stack>
          <Stack direction={'row'} spacing = {2}>
            <TextField 
              label="Message" 
              fullWidth 
              value = {message}
              onChange = {(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button 
              variant = "contained" 
              onClick = {sendMessage}
              disabled={isLoading}
              >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </Stack>
        </Stack>
    </Box>
  );
}
