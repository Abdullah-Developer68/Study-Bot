const signUpUser = async (supabaseClient, email, password) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
    return data;
  }
};

const signInUser = async (supabaseClient, email, password) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const signOutUser = async (supabaseClient) => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};
