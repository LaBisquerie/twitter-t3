import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/clerk-react"
import { api } from "~/utils/api";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import {toast} from 'react-hot-toast'
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const CreatePostWizard = () => {
  const {user} = useUser();

  const [input, setInput] = useState('');

  const ctx = api.useContext();

  const {mutate, isLoading: isPosting} = api.posts.create.useMutation({
    onSuccess: () => { 
      setInput("");
      void ctx.posts.getAll.invalidate(); // Refetch data when post is updated or created
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    }
  });

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <Image src={user.profileImageUrl} alt="Profile image" className="h-14 w-14 rounded-full" width={56} height={56} />
      <input placeholder="Type some text!" className="grow bg-transparent outline-none" type='text' onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => {if(e.key === "Enter"){e.preventDefault(); if (input !== "") {mutate({content: input})}}}} disabled={isPosting}/>
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({content: input})}>Post</button>
      )}
      {isPosting && (
        <div className="flex justify-center items-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  )
}

const Feed = () => {
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />

  if (!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
