import { redirect } from 'react-router-dom';

export function action() {
    localStorage.removeItem('jwtauthtoken');
    localStorage.removeItem('branch_id');
    localStorage.removeItem('branch_name');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    return redirect('/');
}