'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/helpers/blogData";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Facebook,
  Link as LinkIcon,
  Share2,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container text-center">
        <h2 className="text-3xl font-bold mb-4">Post Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The article you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/blog">
          <Button className="bg-primary hover:bg-primary/90 text-white border-none">
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter(
    (p) =>
      p.id !== post.id &&
      (p.category === post.category ||
        p.tags?.some((t) => post.tags?.includes(t)))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground font-body pb-20">
      {/* Breadcrumbs */}
      <div className="container pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground truncate max-w-[200px] md:max-w-none">
            {post.title}
          </span>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-bold mb-10"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Articles
        </Link>
      </div>

      <article>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 px-4 py-1.5 text-sm uppercase tracking-wider font-bold">
              {post.category}
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-muted-foreground mb-12 py-6 border-y border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-3 border border-border-subtle flex items-center justify-center text-xs font-bold text-primary uppercase">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-foreground font-bold">{post.author}</div>
                  <div className="text-xs">{post.authorRole || "Contributor"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="w-full h-[50vh] md:h-[70vh] mb-16 relative">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
        </div>

        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-invert prose-pink max-w-none mb-20 blog-content text-lg leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-surface-2 border border-border-subtle rounded-full text-xs text-muted-foreground hover:text-primary hover:border-primary/30 cursor-pointer transition-all"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Sharing */}
            <div className="bg-surface-2 border border-border-subtle rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-24">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-3 border border-border-subtle flex items-center justify-center text-primary">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Share this article</h4>
                  <p className="text-sm text-muted-foreground">
                    Spread the word to your gaming community
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="bg-surface-3 border-border-subtle hover:bg-surface-3/50 text-muted-foreground hover:text-white px-5"
                >
                  <Twitter className="w-4 h-4 mr-2" /> Twitter
                </Button>
                <Button
                  variant="outline"
                  className="bg-surface-3 border-border-subtle hover:bg-surface-3/50 text-muted-foreground hover:text-white px-5"
                >
                  <Facebook className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button
                  variant="outline"
                  className="bg-surface-3 border-border-subtle hover:bg-surface-3/50 text-muted-foreground hover:text-white w-12 p-0"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <section className="bg-surface-2/30 py-24 border-t border-border-subtle">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">Related Articles</h2>
              <Link href="/blog" className="text-primary font-bold hover:underline">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((p) => (
                <Link href={`/blog/${p.slug}`} key={p.id} className="group">
                  <div className="bg-surface-2 border border-border-subtle rounded-xl overflow-hidden transition-all hover:border-primary/20 flex flex-col h-full">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-surface-3/90 backdrop-blur-md text-foreground border-border-subtle text-[10px] font-bold">
                          {p.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {p.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {p.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .blog-content h2 {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        .blog-content blockquote {
          border-left: 4px solid #ff1b6b;
          padding-left: 2rem;
          font-style: italic;
          font-size: 1.5rem;
          color: white;
          margin: 3rem 0;
          background: rgba(255, 27, 107, 0.05);
          padding-top: 2rem;
          padding-bottom: 2rem;
          padding-right: 2rem;
          border-radius: 0 1rem 1rem 0;
        }
        .blog-content h2 + p {
          margin-top: 0;
        }
      `,
        }}
      />
    </div>
  );
}
