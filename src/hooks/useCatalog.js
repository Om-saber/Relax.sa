/**
 * useCatalog.js — React hook لبيانات الكتالوج من API
 */

import { useState, useEffect, useCallback } from 'react';
import { catalogApi } from '../api/catalogApi';
import { adaptServices, adaptCategories } from '../api/serviceAdapter';
import { SERVICES, CATEGORIES } from '../data/servicesData';

// ─────────────────────────────────────────
// useServices — كل الخدمات
// ─────────────────────────────────────────
export function useServices(params = {}, lang = 'ar') {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const { category, search, city } = params;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiData = await catalogApi.getServices({ category, search, city });
      setServices(adaptServices(apiData, lang));
      setUsingFallback(false);
    } catch (err) {
      console.error('[useServices] API failed, using fallback:', err);
      const filtered = SERVICES.filter((s) => {
        if (category && s.category !== category) return false;
        if (search && !s.title.includes(search) && !s.titleEn.includes(search)) return false;
        return true;
      });
      setServices(filtered);
      setUsingFallback(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, search, city, lang]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, usingFallback, refetch: fetchServices };
}

// ─────────────────────────────────────────
// useCategories — فئات الخدمات
// ─────────────────────────────────────────
export function useCategories(lang = 'ar') {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiData = await catalogApi.getCategories();
      setCategories(adaptCategories(apiData, lang));
      setUsingFallback(false);
    } catch (err) {
      console.error('[useCategories] API failed, using fallback:', err);
      setCategories(CATEGORIES);
      setUsingFallback(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, usingFallback, refetch: fetchCategories };
}

// ─────────────────────────────────────────
// useCities — المدن
// ─────────────────────────────────────────
export function useCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiData = await catalogApi.getCities();
      setCities(apiData);
    } catch (err) {
      console.error('[useCities] API failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return { cities, loading, error, refetch: fetchCities };
}
