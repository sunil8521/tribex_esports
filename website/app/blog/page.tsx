'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BLOG_POSTS } from "@/helpers/blogData";
import { ArrowRight, Calendar, Clock, Search, Tag, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Trends",
  "Strategy",
  "Hardware",
  "Tournaments",
  "Lifestyle",
  "Analysis",
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((post) => post.featured);

  return (
    <div className="min-h-screen bg-background text-foreground font-body pb-20">
      {/* Featured */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-end overflow-hidden border-b border-border-subtle">
        <div className="absolute inset-0 z-0">
          <img
            src={featuredPost?.image}
            alt="Featured"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="container relative z-10 pb-12">
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-4 px-3 py-1 text-xs uppercase tracking-wider font-bold">
            Featured Article
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight mb-6">
            {featuredPost?.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8 line-clamp-2">
            {featuredPost?.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>{featuredPost?.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{featuredPost?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{featuredPost?.readTime}</span>
            </div>
          </div>

          {featuredPost?.slug && (
            <Link href={`/blog/${featuredPost.slug}`}>
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-md text-base font-bold transition-all border-none">
                Read Full Story <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Search & Filters */}
      <div className="container mt-12 mb-16">
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                    selectedCategory === category
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-surface-3 border-border-subtle text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-surface-3 border-border-subtle focus:border-primary/50 transition-all h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-surface-2 border border-border-subtle rounded-xl overflow-hidden transition-all hover:border-primary/20"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-surface-3/90 backdrop-blur-md text-foreground border-border-subtle font-medium">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-3 border border-border-subtle flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-xs font-medium">{post.author}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary text-sm font-bold flex items-center gap-1.5 transition-all hover:gap-2"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-surface-2 border border-border-subtle rounded-2xl p-12 max-w-md mx-auto">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking
                  for.
                </p>
                <Button
                  variant="link"
                  className="text-primary mt-4"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        {filteredPosts.length > 0 && (
          <div className="mt-16 flex justify-center gap-2">
            <Button
              variant="outline"
              className="bg-surface-2 border-border-subtle text-muted-foreground hover:bg-surface-3 hover:text-white"
              disabled
            >
              Previous
            </Button>
            <Button className="bg-primary text-white border-none px-5">1</Button>
            <Button
              variant="outline"
              className="bg-surface-2 border-border-subtle text-muted-foreground hover:bg-surface-3 hover:text-white"
            >
              2
            </Button>
            <Button
              variant="outline"
              className="bg-surface-2 border-border-subtle text-muted-foreground hover:bg-surface-3 hover:text-white"
            >
              3
            </Button>
            <Button
              variant="outline"
              className="bg-surface-2 border-border-subtle text-muted-foreground hover:bg-surface-3 hover:text-white"
            >
              Next
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="container mt-24">
        <div className="bg-surface-2 border border-border-subtle rounded-2xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <Tag className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Get the latest tournament updates, strategy guides, and pro
              insights delivered straight to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                placeholder="Enter your email address"
                className="bg-surface-3 border-border-subtle h-14 text-lg px-6 focus:border-primary/50"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white h-14 px-8 font-bold text-lg border-none shadow-lg shadow-primary/20">
                Subscribe
              </Button>
            </form>
            <p className="mt-6 text-xs text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
