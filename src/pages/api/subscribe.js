// src/pages/api/subscribe.js
// src/pages/api/subscribe.js
import supabase from './supabase';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email address is required.' });
        }

        try {
            const { data, error: selectError } = await supabase
                .from('newsletter_subscribers')
                .select('id')
                .eq('email', email)
                .single();

            if (selectError && selectError.code !== 'PGRST116') {
                throw selectError;
            }

            if (data) {
                return res.status(200).json({ message: 'You are already subscribed!' });
            }

            const { error: insertError } = await supabase.from('newsletter_subscribers').insert([{ email }]);

            if (insertError) {
                throw insertError;
            }

            return res.status(200).json({ message: 'Thank you for subscribing!' });
        } catch (error) {
            console.error('Error subscribing:', error);
            return res.status(500).json({ error: 'Subscription failed. Please try again later.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}