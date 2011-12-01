(ns jukebox-web.views.track-search
  (:use [hiccup core page-helpers]))

(defn results [request]
  [:script#track-result-template {:type "text/example"}
    [:li.result
     [:a.update-playlist {:href "/playlist/add/{{ path }}" :data-remote "true"} "{{ title }}"]
     [:p.artist "{{ artist }}"]]])

(defn display-search [request]
  [:div#track-search-container
    [:form#search {:action "/library/search" :method "get" :data-remote "true" }
     [:input#query {:type "text" :name "q" :placeholder "Search for Artist, Album or Song"}]
     [:ul#track-search-results]]
    (results request)])