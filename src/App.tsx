import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PostsManager from "./pages/admin/PostsManager";
import CategoriesManager from "./pages/admin/CategoriesManager";
import QuotesManager from "./pages/admin/QuotesManager";
import NewsManager from "./pages/admin/NewsManager";
import QuizzesManager from "./pages/admin/QuizzesManager";
import StoriesManager from "./pages/admin/StoriesManager";
import CommentsManager from "./pages/admin/CommentsManager";
import UsersManager from "./pages/admin/UsersManager";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<PostsManager />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="quotes" element={<QuotesManager />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="quizzes" element={<QuizzesManager />} />
              <Route path="stories" element={<StoriesManager />} />
              <Route path="comments" element={<CommentsManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
