"use client";
import { useState } from "react";
import { supabase } from "../../util/supabase";

export default function TestSupabase() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Try to select 1 row from any table (replace 'your_table' with your actual table name)
      const { data, error } = await supabase.from('User').select('*').limit(1);
      if (error) {
        setError(error.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Supabase Connection Test</h1>
      <button onClick={testConnection} disabled={loading}>
        {loading ? "Testing..." : "Test Connection"}
      </button>
      {result && (
        <pre>Result: {JSON.stringify(result, null, 2)}</pre>
      )}
      {error && <pre style={{ color: "red" }}>Error: {error}</pre>}
    </div>
  );
}
