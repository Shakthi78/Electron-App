import axios from 'axios';
import { Meeting } from '../components/Meetings';

// const isDev = process.env.NODE_ENV !== 'production';
const baseURL = 'https://exceleed.in/api/v1/watch';

const api = axios.create({ baseURL });

// Define the Meeting interface (adjust fields to match your backend response)


export const fetchMeetings = async (roomName: string): Promise<Meeting[]> => {
    const response = await api.get<Meeting[]>(`/meetings/${roomName}`);
    return response.data;
};