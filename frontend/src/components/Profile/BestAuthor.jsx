import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const authors = [
  {
    name: "J.K. Rowling ✨",
    image: "https://ts2.explicit.bing.net/th?id=OIP.FXB0f2LWP-khJuSohiv8jQHaIy&pid=15.1",
    description: "Author of the Harry Potter series, J.K. Rowling's journey from struggling writer to global literary icon is an inspiration. Her works emphasize courage, friendship, and the magic of imagination."
  },
  {
    name: "George Orwell 🖋️",
    image: "https://th.bing.com/th/id/OIP.bG6NjOFXx5q-Js2sRaZ04gHaKr?w=127&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    description: "A master of dystopian fiction, Orwell's '1984' and 'Animal Farm' critique political corruption and advocate for freedom of thought."
  },
  {
    name: "Paulo Coelho 🌎",
    image: "https://th.bing.com/th/id/OIP.HekvUnS1ifn8ZMqR6qzsFQHaHa?rs=1&pid=ImgDetMain",
    description: "Best known for 'The Alchemist', Coelho’s books revolve around spirituality, destiny, and self-discovery, inspiring millions."
  },
  {
    name: "Agatha Christie 🔍",
    image: "https://th.bing.com/th/id/OIP.EojcvU1moVMNUga5KkUVywHaHc?rs=1&pid=ImgDetMain",
    description: "The Queen of Mystery, Agatha Christie's crime novels and detective stories continue to captivate readers worldwide."
  },
  {
    name: "Stephen King 👻",
    image: "https://th.bing.com/th/id/OIP.Roh8PZ2IuKoyvxXgFM_kvQAAAA?rs=1&pid=ImgDetMain",
    description: "A legend in horror fiction, King’s works explore fear, human psychology, and supernatural themes. His storytelling is unmatched."
  }
];

const BestAuthors = () => {
  const [index, setIndex] = useState(0);

  const nextAuthor = () => setIndex((prevIndex) => (prevIndex + 1) % authors.length);
  const prevAuthor = () => setIndex((prevIndex) => (prevIndex - 1 + authors.length) % authors.length);

  return (
    <div className="p-10 bg-gray-100 flex flex-col items-center justify-center text-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">📚 Best Authors of All Time</h1>
      <div className="relative w-full max-w-md">
        <button
          onClick={prevAuthor}
          className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
        <div className="overflow-hidden w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={authors[index].name}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="bg-white p-6 rounded-lg shadow-lg w-full text-center"
            >
              <img
                src={authors[index].image}
                alt={authors[index].name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-gray-300 shadow-md"
              />
              <h2 className="text-2xl font-semibold text-gray-900">{authors[index].name}</h2>
              <p className="text-gray-700 mt-2">{authors[index].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          onClick={nextAuthor}
          className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default BestAuthors;