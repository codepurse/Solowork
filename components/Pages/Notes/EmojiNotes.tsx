import { X } from "lucide-react";
import { useState } from "react";
import Text from "../../Elements/Text";

const emojis = [
  { name: "Grinning Face", emoji: "😀" },
  { name: "Grinning Face with Big Eyes", emoji: "😃" },
  { name: "Grinning Face with Smiling Eyes", emoji: "😄" },
  { name: "Beaming Face with Smiling Eyes", emoji: "😁" },
  { name: "Grinning Squinting Face", emoji: "😆" },
  { name: "Grinning Face with Sweat", emoji: "😅" },
  { name: "Face with Tears of Joy", emoji: "😂" },
  { name: "Rolling on the Floor Laughing", emoji: "🤣" },
  { name: "Smiling Face with Smiling Eyes", emoji: "😊" },
  { name: "Smiling Face with Halo", emoji: "😇" },
  { name: "Slightly Smiling Face", emoji: "🙂" },
  { name: "Upside-Down Face", emoji: "🙃" },
  { name: "Winking Face", emoji: "😉" },
  { name: "Relieved Face", emoji: "😌" },
  { name: "Smiling Face with Hearts", emoji: "😍" },
  { name: "Face Blowing a Kiss", emoji: "😘" },
  { name: "Kissing Face", emoji: "😗" },
  { name: "Kissing Face with Smiling Eyes", emoji: "😙" },
  { name: "Kissing Face with Closed Eyes", emoji: "😚" },
  { name: "Face Savoring Food", emoji: "😋" },
  { name: "Face with Tongue", emoji: "😛" },
  { name: "Squinting Face with Tongue", emoji: "😝" },
  { name: "Winking Face with Tongue", emoji: "😜" },
  { name: "Zany Face", emoji: "🤪" },
  { name: "Face with Raised Eyebrow", emoji: "🤨" },
  { name: "Face with Monocle", emoji: "🧐" },
  { name: "Nerd Face", emoji: "🤓" },
  { name: "Smiling Face with Sunglasses", emoji: "😎" },
  { name: "Partying Face", emoji: "🥳" },
  { name: "Exploding Head", emoji: "🤯" },
  { name: "Face with Steam From Nose", emoji: "😤" },
  { name: "Angry Face", emoji: "😡" },
  { name: "Pleading Face", emoji: "🥺" },
  { name: "Crying Face", emoji: "😢" },
  { name: "Loudly Crying Face", emoji: "😭" },
];

const gestureEmojis = [
  { name: "Waving Hand", emoji: "👋" },
  { name: "Raised Back of Hand", emoji: "🤚" },
  { name: "Hand with Fingers Splayed", emoji: "🖐️" },
  { name: "Raised Hand", emoji: "✋" },
  { name: "Vulcan Salute", emoji: "🖖" },
  { name: "OK Hand", emoji: "👌" },
  { name: "Pinched Fingers", emoji: "🤌" },
  { name: "Pinching Hand", emoji: "🤏" },
  { name: "Victory Hand", emoji: "✌️" },
  { name: "Crossed Fingers", emoji: "🤞" },
  { name: "Hand with Index Finger and Thumb Crossed", emoji: "🫰" },
  { name: "Love-You Gesture", emoji: "🤟" },
  { name: "Sign of the Horns", emoji: "🤘" },
  { name: "Call Me Hand", emoji: "🤙" },
  { name: "Backhand Index Pointing Left", emoji: "👈" },
  { name: "Backhand Index Pointing Right", emoji: "👉" },
  { name: "Backhand Index Pointing Up", emoji: "👆" },
  { name: "Middle Finger", emoji: "🖕" },
  { name: "Backhand Index Pointing Down", emoji: "👇" },
  { name: "Index Pointing Up", emoji: "☝️" },
  { name: "Thumbs Up", emoji: "👍" },
  { name: "Thumbs Down", emoji: "👎" },
  { name: "Raised Fist", emoji: "✊" },
  { name: "Oncoming Fist", emoji: "👊" },
  { name: "Left-Facing Fist", emoji: "🤛" },
  { name: "Right-Facing Fist", emoji: "🤜" },
  { name: "Clapping Hands", emoji: "👏" },
  { name: "Raising Hands", emoji: "🙌" },
];

const animalEmojis = [
  { name: "Dog Face", emoji: "🐶" },
  { name: "Cat Face", emoji: "🐱" },
  { name: "Mouse Face", emoji: "🐭" },
  { name: "Hamster Face", emoji: "🐹" },
  { name: "Rabbit Face", emoji: "🐰" },
  { name: "Fox Face", emoji: "🦊" },
  { name: "Bear Face", emoji: "🐻" },
  { name: "Panda Face", emoji: "🐼" },
  { name: "Koala Face", emoji: "🐨" },
  { name: "Tiger Face", emoji: "🐯" },
  { name: "Lion Face", emoji: "🦁" },
  { name: "Cow Face", emoji: "🐮" },
  { name: "Pig Face", emoji: "🐷" },
  { name: "Pig Nose", emoji: "🐽" },
  { name: "Frog Face", emoji: "🐸" },
  { name: "Monkey Face", emoji: "🐵" },
  { name: "See-No-Evil Monkey", emoji: "🙈" },
  { name: "Hear-No-Evil Monkey", emoji: "🙉" },
  { name: "Speak-No-Evil Monkey", emoji: "🙊" },
  { name: "Chicken", emoji: "🐔" },
  { name: "Penguin", emoji: "🐧" },
  { name: "Bird", emoji: "🐦" },
  { name: "Baby Chick", emoji: "🐤" },
  { name: "Hatching Chick", emoji: "🐣" },
  { name: "Front-Facing Baby Chick", emoji: "🐥" },
  { name: "Duck", emoji: "🦆" },
  { name: "Eagle", emoji: "🦅" },
  { name: "Owl", emoji: "🦉" },
  { name: "Bat", emoji: "🦇" },
  { name: "Wolf Face", emoji: "🐺" },
  { name: "Boar", emoji: "🐗" },
  { name: "Horse Face", emoji: "🐴" },
  { name: "Unicorn Face", emoji: "🦄" },
  { name: "Honeybee", emoji: "🐝" },
  { name: "Worm", emoji: "🪱" },
];

const plantEmojis = [
  { name: "Seedling", emoji: "🌱" },
  { name: "Herb", emoji: "🌿" },
  { name: "Shamrock", emoji: "☘️" },
  { name: "Four Leaf Clover", emoji: "🍀" },
  { name: "Pine Decoration", emoji: "🎍" },
  { name: "Potted Plant", emoji: "🪴" },
  { name: "Cactus", emoji: "🌵" },
  { name: "Palm Tree", emoji: "🌴" },
  { name: "Deciduous Tree", emoji: "🌳" },
  { name: "Evergreen Tree", emoji: "🌲" },
  { name: "Sheaf of Rice", emoji: "🌾" },
  { name: "Tulip", emoji: "🌷" },
  { name: "Rose", emoji: "🌹" },
  { name: "Wilted Flower", emoji: "🥀" },
  { name: "Hibiscus", emoji: "🌺" },
  { name: "Cherry Blossom", emoji: "🌸" },
  { name: "Blossom", emoji: "🌼" },
  { name: "Bouquet", emoji: "💐" },
  { name: "Maple Leaf", emoji: "🍁" },
  { name: "Fallen Leaf", emoji: "🍂" },
  { name: "Leaf Fluttering in Wind", emoji: "🍃" },
  { name: "Sunflower", emoji: "🌻" },
  { name: "Hyacinth", emoji: "🪻" },
  { name: "Lotus", emoji: "🪷" },
  { name: "Coral", emoji: "🪸" },
  { name: "Empty Nest", emoji: "🪹" },
  { name: "Nest with Eggs", emoji: "🪺" },
  { name: "Garlic", emoji: "🧄" },
];

const foodAndDrinkEmojis = [
  { name: "Green Apple", emoji: "🍏" },
  { name: "Red Apple", emoji: "🍎" },
  { name: "Pear", emoji: "🍐" },
  { name: "Orange", emoji: "🍊" },
  { name: "Lemon", emoji: "🍋" },
  { name: "Banana", emoji: "🍌" },
  { name: "Watermelon", emoji: "🍉" },
  { name: "Grapes", emoji: "🍇" },
  { name: "Strawberry", emoji: "🍓" },
  { name: "Blueberries", emoji: "🫐" },
  { name: "Melon", emoji: "🍈" },
  { name: "Cherries", emoji: "🍒" },
  { name: "Peach", emoji: "🍑" },
  { name: "Mango", emoji: "🥭" },
  { name: "Pineapple", emoji: "🍍" },
  { name: "Coconut", emoji: "🥥" },
  { name: "Kiwi Fruit", emoji: "🥝" },
  { name: "Tomato", emoji: "🍅" },
  { name: "Eggplant", emoji: "🍆" },
  { name: "Avocado", emoji: "🥑" },
  { name: "Broccoli", emoji: "🥦" },
  { name: "Leafy Green", emoji: "🥬" },
  { name: "Carrot", emoji: "🥕" },
  { name: "Corn", emoji: "🌽" },
  { name: "Potato", emoji: "🥔" },
  { name: "Sweet Potato", emoji: "🍠" },
  { name: "Garlic", emoji: "🧄" },
  { name: "Onion", emoji: "🧅" },
  { name: "Bread", emoji: "🍞" },
  { name: "Croissant", emoji: "🥐" },
  { name: "Baguette Bread", emoji: "🥖" },
  { name: "Pretzel", emoji: "🥨" },
  { name: "Bagel", emoji: "🥯" },
  { name: "Waffle", emoji: "🧇" },
  { name: "Pancakes", emoji: "🥞" },
];

const activityAndSportsEmojis = [
  { name: "Soccer Ball", emoji: "⚽" },
  { name: "Basketball", emoji: "🏀" },
  { name: "American Football", emoji: "🏈" },
  { name: "Baseball", emoji: "⚾" },
  { name: "Softball", emoji: "🥎" },
  { name: "Tennis", emoji: "🎾" },
  { name: "Volleyball", emoji: "🏐" },
  { name: "Rugby Football", emoji: "🏉" },
  { name: "Flying Disc", emoji: "🥏" },
  { name: "Pool 8 Ball", emoji: "🎱" },
  { name: "Ping Pong", emoji: "🏓" },
  { name: "Badminton", emoji: "🏸" },
  { name: "Goal Net", emoji: "🥅" },
  { name: "Ice Hockey", emoji: "🏒" },
  { name: "Field Hockey", emoji: "🏑" },
  { name: "Cricket Game", emoji: "🏏" },
  { name: "Lacrosse", emoji: "🥍" },
  { name: "Bow and Arrow", emoji: "🏹" },
  { name: "Fishing Pole", emoji: "🎣" },
  { name: "Diving Mask", emoji: "🤿" },
  { name: "Boxing Glove", emoji: "🥊" },
  { name: "Martial Arts Uniform", emoji: "🥋" },
  { name: "Running Shirt", emoji: "🎽" },
  { name: "Skateboard", emoji: "🛹" },
  { name: "Roller Skate", emoji: "🛼" },
  { name: "Ice Skate", emoji: "⛸️" },
  { name: "Skis", emoji: "🎿" },
  { name: "Skier", emoji: "⛷️" },
  { name: "Snowboarder", emoji: "🏂" },
  { name: "Person Lifting Weights", emoji: "🏋️" },
  { name: "People Wrestling", emoji: "🤼" },
  { name: "Person Cartwheeling", emoji: "🤸" },
  { name: "Person Bouncing Ball", emoji: "⛹️" },
  { name: "Person Fencing", emoji: "🤺" },
  { name: "Person Playing Handball", emoji: "🤾" },
];

const finalEmojis = [
  ...emojis,
  ...gestureEmojis,
  ...animalEmojis,
  ...plantEmojis,
  ...foodAndDrinkEmojis,
  ...activityAndSportsEmojis,
];

interface EmojiNotesProps {
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

export default function EmojiNotes({
  onClose,
  onSelect,
}: Readonly<EmojiNotesProps>) {
  const [search, setSearch] = useState("");

  return (
    <div className="emoji-notes animate__fadeIn animate__animated">
      <div className="emoji-notes-header">
        <span>Select Emoji</span>
        <i onClick={onClose}>
          <X size={18} color="#bdbdbd" />
        </i>
      </div>
      <Text
        variant="sm"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        as="search"
        className="mt-2"
      />
      <hr className="not-faded-line" style={{ margin: "5px 0px 13px 0px" }} />
      <div className="emoji-notes-list">
        {finalEmojis
          .filter((emojiObj) =>
            emojiObj.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((emojiObj, index) => (
            <span
              key={index}
              title={emojiObj.name}
              onClick={() => onSelect(emojiObj.emoji)}
            >
              {emojiObj.emoji}
            </span>
          ))}
      </div>
    </div>
  );
}
