import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(r => setSession(r?.data?.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <Layout session={session}>
      <Component {...pageProps} session={session} />
    </Layout>
  );
}

export default MyApp;
