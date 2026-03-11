"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createTemplate,
  getTemplateById,
  updateTemplate,
} from "@studybot/supabase";
import Editor from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/auth/useAuth";
import { createClient } from "@/utils/supabase/client";

const supabaseClient = createClient();

const EMPTY_TEMPLATE_DOC = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
      },
    },
  ],
};

const NewTemplatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId, loading: authLoading } = useAuth();

  const templateId = searchParams.get("templateId");
  const isEditing = Boolean(templateId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState(EMPTY_TEMPLATE_DOC);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing || authLoading || !userId) {
      return;
    }

    let isMounted = true;

    const loadTemplate = async () => {
      setIsLoading(true);
      setError("");

      const result = await getTemplateById(supabaseClient, templateId);

      if (!isMounted) {
        return;
      }

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (!result.template) {
        setError("Template not found");
        setIsLoading(false);
        return;
      }

      setName(result.template.name ?? "");
      setDescription(result.template.description ?? "");
      setCategory(result.template.category ?? "");
      setTagsInput((result.template.tags ?? []).join(", "));
      setContent(result.template.content ?? EMPTY_TEMPLATE_DOC);
      setIsLoading(false);
    };

    loadTemplate();

    return () => {
      isMounted = false;
    };
  }, [authLoading, isEditing, templateId, userId]);

  const handleSave = async () => {
    if (!userId) {
      setError("You must be signed in to save templates.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = {
      profileId: userId,
      name,
      description,
      category,
      tags: tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean),
      content,
    };

    const result = isEditing
      ? await updateTemplate(supabaseClient, templateId, payload)
      : await createTemplate(supabaseClient, payload);

    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/templates");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Template" : "New Template"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Build and save reusable custom templates as TipTap JSON.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push("/templates")}> 
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading || authLoading}>
            {isSaving ? "Saving..." : isEditing ? "Update Template" : "Save Template"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Meeting Notes"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-sm font-medium">Category</label>
            <Input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="notes"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what this template is for"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium">Tags</label>
            <Input
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="meeting, internal, notes"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-500 md:col-span-2">{error}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading template...</p>
          ) : (
            <Editor initialContent={content} onChange={setContent} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTemplatePage;
