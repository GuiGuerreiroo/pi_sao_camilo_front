import axios from 'axios';
import type { GroupInterface } from '../../interface/GroupInterface';

export async function get_all_groups_by_supporter(): Promise<GroupInterface[]> {
    const baseURL = import.meta.env.VITE_MSS_API_URL || 'https://p4fl1wlirb.execute-api.us-east-1.amazonaws.com/dev/pnesc-mss';
    const token = localStorage.getItem('token');

    const response = await axios.get(
        `${baseURL}/get-all-groups-by-supporter`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data.groups || response.data;
}