// components/AddFileForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { invoke } from "@tauri-apps/api/core";

export function AddFileForm() {
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("");
  const [link, setLink] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [folderId, setFolderId] = useState(1); // default root
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setResult("Selecione um arquivo.");
      return;
    }

    setLoading(true);
    const arrayBuffer = await file.arrayBuffer();
    const content = Array.from(new Uint8Array(arrayBuffer));

    try {
      const res = await invoke("add_file_command", {
        name,
        fileType,
        content,
        link: link || null,
        folderId,
        isFavorite,
      });
      setResult("Arquivo adicionado com sucesso!");
      console.log("Resultado:", res);
    } catch (err) {
      console.error(err);
      setResult("Erro ao adicionar o arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <div>
        <Label>Nome</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label>Tipo</Label>
        <Input value={fileType} onChange={(e) => setFileType(e.target.value)} required />
      </div>

      <div>
        <Label>Link (opcional)</Label>
        <Input value={link} onChange={(e) => setLink(e.target.value)} />
      </div>

      <div>
        <Label>Arquivo</Label>
        <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="favorite" checked={isFavorite} onCheckedChange={() => setIsFavorite(!isFavorite)} />
        <Label htmlFor="favorite">Favorito</Label>
      </div>

      <div>
        <Label>ID da Pasta</Label>
        <Input
          type="number"
          value={folderId}
          onChange={(e) => setFolderId(parseInt(e.target.value, 10))}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Adicionar Arquivo"}
      </Button>

      {result && <p className="text-sm text-muted-foreground">{result}</p>}
    </form>
  );
}
