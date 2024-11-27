/**
 * Used for connecting to OpenAI.
 * Provides connection, and response function wrapper
 * @author Christopher Curtis
 */
import OpenAI from 'openai';
import fs from 'fs';

// Creates an OpenAI connection using the provided api key
const openai = new OpenAI({
    apiKey: null
});

/**
 * Function for getting a response from the gpt model.
 * Uses the provided message history
 * @param messages the message history to load in
 * @returns gpt response object
 */
const getGptResonse =  async (messages) => await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
});


export { getGptResonse };