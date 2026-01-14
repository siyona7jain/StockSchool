import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, TrendingUp, PieChart, Scale, Brain,
  ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Send, 
  Lightbulb, MessageCircle, Wallet, BarChart3, Shield, Clock, Target, Calendar, DollarSign, Globe, Store, Briefcase, RefreshCw, AlertTriangle, X
} from "lucide-react";
import { LessonQuiz, QuizQuestion } from "@/components/learn/LessonQuiz";
import { callOpenAI } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

const lessonsContent: Record<string, {
  icon: React.ElementType;
  title: string;
  color: string;
  sections: { title: string; content: string; analogy?: string }[];
  checkQuestion: { question: string; hint: string };
  quiz: QuizQuestion[];
}> = {
  investing: {
    icon: Target,
    title: "What Is Investing?",
    color: "accent",
    sections: [
      {
        title: "What Investing Means",
        content: "Investing means putting money into something with the goal of growing it over time. When you invest, you are accepting some risk in exchange for possible reward. Investing is different from saving, which is about protecting money, not growing it.",
        analogy: "Think of saving like keeping your money in a safe box — it's protected, but it stays the same. Investing is like planting seeds — you risk them not growing, but if they do, they can turn into something much bigger!"
      },
      {
        title: "The Scenario",
        content: "You have $100. You can keep it in cash, or invest it in a company that might grow. If the company grows, your $100 could become more. If it struggles, you could lose some money. This is the risk-reward trade-off of investing.",
        analogy: "Imagine you have $100 to either keep in your wallet or use to buy a lemonade stand. If you keep it in your wallet, you'll always have $100. But if you buy the stand and it does well, you might turn that $100 into $150 or more. However, if it fails, you could lose some or all of your $100."
      },
      {
        title: "Investing vs. Saving",
        content: "Saving is about keeping your money safe and accessible. Investing is about growing your money over time, but with the risk that you might lose some. Both are important, but they serve different purposes. You should save money you'll need soon, and invest money you can leave alone for a while.",
      }
    ],
    checkQuestion: {
      question: "Why do people invest instead of just saving money?",
      hint: "Think about what happens to money that just sits in a savings account over many years — does it grow, or does it lose value?"
    },
    quiz: [
      {
        id: "i1",
        question: "What is investing?",
        options: ["Keeping money safe in a bank", "Putting money into something with the goal of growing it over time", "Spending all your money", "Lending money to friends"],
        correctAnswer: 1,
        explanation: "Investing means putting money into something (like stocks, bonds, or companies) with the goal of growing it over time."
      },
      {
        id: "i2",
        question: "What's the main difference between saving and investing?",
        options: ["Saving grows money, investing keeps it safe", "Investing is about growing money (with risk), saving is about protecting money", "There's no difference", "Saving is illegal"],
        correctAnswer: 1,
        explanation: "Investing aims to grow your money over time but comes with risk. Saving protects your money but doesn't usually grow much."
      },
      {
        id: "i3",
        question: "If you invest $100 in a company and it does well, what might happen?",
        options: ["You'll definitely lose money", "Your $100 could become more", "Nothing will change", "You'll only ever have $100"],
        correctAnswer: 1,
        explanation: "If the company grows and does well, your investment could increase in value, so your $100 might become $120, $150, or even more!"
      }
    ]
  },
  longterm: {
    icon: Calendar,
    title: "Long-Term vs Short-Term Investing",
    color: "accent",
    sections: [
      {
        title: "Two Different Approaches",
        content: "Short-term investing focuses on quick price changes, trying to buy low and sell high in days, weeks, or months. Long-term investing focuses on growth over time, holding investments for years or even decades. Long-term investing usually involves less stress and fewer decisions.",
        analogy: "Think of it like gardening. Short-term investing is like picking flowers every day — lots of work, constant attention, and you might miss the best blooms. Long-term investing is like planting a tree — you water it, wait patiently, and over years it grows into something strong and valuable!"
      },
      {
        title: "The Scenario",
        content: "A stock drops one week but grows steadily over five years. Short-term investors panic and sell when they see the drop, missing out on the long-term growth. Long-term investors stay invested and benefit later, seeing their investment grow over time despite temporary dips.",
        analogy: "Imagine a roller coaster. Short-term investors get off at the first scary drop, missing the rest of the ride. Long-term investors stay on through all the ups and downs, enjoying the full experience and ending up much further ahead!"
      },
      {
        title: "Why Patience Matters",
        content: "The stock market has ups and downs, but over long periods, it has historically trended upward. Long-term investors benefit from this overall growth by staying invested through temporary declines. They don't need to time the market perfectly — they just need to be patient.",
      }
    ],
    checkQuestion: {
      question: "Why might patience be important in investing?",
      hint: "Think about what happens to investments over long periods versus short periods. What do temporary drops matter if the overall trend is upward?"
    },
    quiz: [
      {
        id: "lt1",
        question: "What is the main difference between short-term and long-term investing?",
        options: ["Short-term is riskier", "Short-term focuses on quick price changes, long-term focuses on growth over time", "Long-term is illegal", "There's no difference"],
        correctAnswer: 1,
        explanation: "Short-term investing tries to profit from quick price movements, while long-term investing focuses on holding investments for years to benefit from overall growth."
      },
      {
        id: "lt2",
        question: "If a stock drops one week but grows steadily over five years, what might short-term investors do?",
        options: ["Stay invested and benefit", "Panic and sell, missing out on long-term growth", "Buy more immediately", "Nothing"],
        correctAnswer: 1,
        explanation: "Short-term investors often react to temporary drops by selling, which means they miss out on the long-term growth that patient investors benefit from."
      },
      {
        id: "lt3",
        question: "Why is patience important in investing?",
        options: ["Because you can't sell stocks quickly", "Because the market has ups and downs, but long-term trends upward over time", "Because patience makes you rich instantly", "Because it's required by law"],
        correctAnswer: 1,
        explanation: "Patience is important because while markets have temporary declines, they have historically trended upward over long periods. Patient investors benefit from this overall growth."
      }
    ]
  },
  marketmovements: {
    icon: BarChart3,
    title: "Why Do Markets Go Up and Down?",
    color: "accent",
    sections: [
      {
        title: "What Moves Markets",
        content: "Markets react to economic news, interest rates, and events happening around the world. Fear and confidence influence prices — when people feel confident, prices tend to rise. When they feel fearful, prices often fall. Short-term movements are unpredictable and can seem random.",
        analogy: "Think of markets like a crowd at a concert. When good news comes (like a favorite song starting), the crowd gets excited and moves forward (prices go up). When something unexpected happens (like a technical glitch), the crowd might step back (prices go down). The movements are based on how everyone feels in that moment!"
      },
      {
        title: "The Scenario",
        content: "News about higher interest rates causes markets to drop. Many investors react quickly, selling their investments because they're worried. Long-term investors wait instead of reacting, understanding that short-term news doesn't always reflect long-term value. They know markets often overreact to news.",
        analogy: "Imagine a weather forecast says it might rain tomorrow. Short-term thinkers might cancel all their plans immediately. Long-term thinkers check the forecast, see it's just one day, and know the sun will come out again. Markets work similarly — one piece of news doesn't change everything forever!"
      },
      {
        title: "Understanding Market Reactions",
        content: "Markets can overreact because emotions drive short-term decisions. Good news can make prices rise too high, and bad news can make them fall too low. Over time, prices usually return to reflect the actual value of companies. This is why long-term investors don't panic at every market movement.",
      }
    ],
    checkQuestion: {
      question: "Why might markets overreact in the short term?",
      hint: "Think about what drives short-term market movements — is it logic and careful analysis, or something else?"
    },
    quiz: [
      {
        id: "mm1",
        question: "What causes markets to move up and down?",
        options: ["Only company profits", "Economic news, interest rates, events, and emotions like fear and confidence", "Nothing — markets never change", "Only government decisions"],
        correctAnswer: 1,
        explanation: "Markets react to many factors including economic news, interest rates, world events, and emotions like fear and confidence. All of these influence whether people want to buy or sell."
      },
      {
        id: "mm2",
        question: "When news about higher interest rates causes markets to drop, what do long-term investors typically do?",
        options: ["Panic and sell immediately", "Wait instead of reacting, understanding short-term news doesn't always reflect long-term value", "Buy everything immediately", "Stop investing forever"],
        correctAnswer: 1,
        explanation: "Long-term investors understand that markets often overreact to news. They wait and don't make hasty decisions based on short-term market movements."
      },
      {
        id: "mm3",
        question: "Why might markets overreact in the short term?",
        options: ["Because computers control everything", "Because emotions drive short-term decisions, causing prices to move too high or too low", "Because markets are always wrong", "Because no one knows what they're doing"],
        correctAnswer: 1,
        explanation: "Markets can overreact because emotions like fear and excitement drive short-term decisions. This can cause prices to rise too high on good news or fall too low on bad news, even when the long-term value hasn't really changed."
      }
    ]
  },
  dividends: {
    icon: DollarSign,
    title: "How Dividends Work",
    color: "accent",
    sections: [
      {
        title: "What Are Dividends?",
        content: "Some companies pay dividends to shareholders. Dividends are regular payments made from a company's profits to the people who own its stock. Dividends provide income, not just price growth. This means you can earn money from owning a stock even if its price doesn't go up. Not all companies pay dividends — some prefer to reinvest all profits back into growing the business.",
        analogy: "Think of dividends like getting a small allowance from a lemonade stand you own. Even if the stand's value doesn't change, you still get a little money each month from the profits. Some stands give you this allowance (dividends), while others use all the money to buy more supplies and grow bigger (reinvesting profits)."
      },
      {
        title: "The Scenario",
        content: "A company pays a small amount to shareholders each year. Investors earn money even if the price doesn't change. This predictable income can be especially valuable for people who need regular cash flow, like retirees. The dividend amount is usually small compared to the stock price, but it adds up over time.",
        analogy: "Imagine you own a rental property. Even if the property's value stays the same, you still collect rent every month. That rent is like a dividend — it's regular income you receive just for owning the property, separate from whether the property's value goes up or down."
      },
      {
        title: "Why Dividends Matter",
        content: "Dividends can provide steady, predictable income. This is different from hoping the stock price will go up — with dividends, you get paid regularly. Some investors prefer dividend-paying stocks because they provide income they can count on, even when markets are volatile.",
      }
    ],
    checkQuestion: {
      question: "Why might investors like predictable income?",
      hint: "Think about what happens when you need money regularly — is it easier to plan when you know money is coming, or when you're hoping prices will go up?"
    },
    quiz: [
      {
        id: "d1",
        question: "What are dividends?",
        options: ["Taxes on stocks", "Regular payments from company profits to shareholders", "Fees for buying stocks", "Interest on loans"],
        correctAnswer: 1,
        explanation: "Dividends are regular payments that companies make to shareholders from their profits. Not all companies pay dividends."
      },
      {
        id: "d2",
        question: "How do dividends differ from price growth?",
        options: ["They're the same thing", "Dividends provide income, while price growth is about the stock's value increasing", "Dividends are always larger", "Price growth is more reliable"],
        correctAnswer: 1,
        explanation: "Dividends provide regular income payments, while price growth means the stock itself becomes more valuable. You can earn dividends even if the price doesn't change."
      },
      {
        id: "d3",
        question: "Why might investors like predictable income from dividends?",
        options: ["Because it's always more than price growth", "Because it provides steady cash flow they can count on, even when markets are volatile", "Because dividends are guaranteed forever", "Because it means the company is failing"],
        correctAnswer: 1,
        explanation: "Predictable income from dividends helps investors plan their finances. They know they'll receive regular payments, which is especially valuable when stock prices are going up and down."
      }
    ]
  },
  economy: {
    icon: Globe,
    title: "How the Economy Affects Investing",
    color: "accent",
    sections: [
      {
        title: "The Stock Market Reflects the Economy",
        content: "The stock market reflects the overall economy. When the economy is doing well, companies tend to make more money, and stock prices often rise. When the economy struggles, companies may make less money, and stock prices often fall. Things like jobs, inflation, and interest rates matter because they affect how much money people and companies have to spend and invest.",
        analogy: "Think of the stock market like a mirror reflecting the economy. If the economy is a sunny day, the mirror shows brightness (stocks go up). If the economy is a storm, the mirror shows darkness (stocks go down). The mirror doesn't create the weather — it just reflects what's happening!"
      },
      {
        title: "The Scenario",
        content: "When interest rates rise, borrowing becomes more expensive. Companies may grow more slowly because they can't afford to borrow money for expansion. Consumers also spend less because loans cost more. Stock prices can fall because slower growth means lower profits. Economic changes affect many companies at once, which is why the entire market often moves together.",
        analogy: "Imagine interest rates are like the price of fuel for a road trip. When fuel gets expensive (interest rates rise), fewer people take trips (companies borrow less), and everyone slows down (growth slows). When fuel is cheap (interest rates are low), more people travel (companies borrow more), and everyone speeds up (growth increases)."
      },
      {
        title: "Why Markets Move Together",
        content: "Economic changes affect many companies at once because they all operate in the same economy. If interest rates rise, it affects almost every company that borrows money. If unemployment rises, it affects almost every company that sells products to consumers. This is why the entire market often moves together — they're all responding to the same economic conditions.",
      }
    ],
    checkQuestion: {
      question: "Why might the entire market move together?",
      hint: "Think about what affects all companies at the same time — is it something specific to one company, or something bigger that affects everyone?"
    },
    quiz: [
      {
        id: "e1",
        question: "How does the stock market relate to the economy?",
        options: ["They're completely separate", "The stock market reflects the overall economy", "The economy doesn't matter", "Only small companies are affected"],
        correctAnswer: 1,
        explanation: "The stock market reflects the overall economy. When the economy does well, companies tend to make more money and stock prices often rise. When the economy struggles, the opposite happens."
      },
      {
        id: "e2",
        question: "What happens when interest rates rise?",
        options: ["Nothing changes", "Borrowing becomes more expensive, companies may grow more slowly, and stock prices can fall", "Everything gets better", "Only tech companies are affected"],
        correctAnswer: 1,
        explanation: "When interest rates rise, borrowing becomes more expensive. This slows down company growth and consumer spending, which can cause stock prices to fall."
      },
      {
        id: "e3",
        question: "Why might the entire market move together?",
        options: ["Because all companies are the same", "Because economic changes affect many companies at once", "Because investors always agree", "Because it's random"],
        correctAnswer: 1,
        explanation: "Economic changes like interest rates, inflation, and unemployment affect almost all companies at the same time, which is why the entire market often moves together in response to economic conditions."
      }
    ]
  },
  exchange: {
    icon: Store,
    title: "What Is a Stock Exchange?",
    color: "accent",
    sections: [
      {
        title: "What Is a Stock Exchange?",
        content: "Stock exchanges are places where stocks are bought and sold. They're like marketplaces where buyers and sellers come together to trade. Examples include NYSE (New York Stock Exchange) and NASDAQ. They help match buyers and sellers, making it easy for people to buy or sell stocks. Without exchanges, it would be very difficult to find someone who wants to buy what you're selling or sell what you want to buy.",
        analogy: "Think of a stock exchange like a farmers market. At a farmers market, people who grow vegetables (sellers) come together with people who want to buy vegetables (buyers). The market makes it easy for them to find each other and make trades. A stock exchange works the same way, but for stocks instead of vegetables!"
      },
      {
        title: "The Scenario",
        content: "A buyer wants to purchase a stock. A seller wants to sell it. The exchange connects them. The exchange makes sure the trade happens fairly and safely. It also sets rules so everyone knows how trading works. This makes buying and selling stocks much easier than if you had to find buyers and sellers yourself.",
        analogy: "Imagine you want to sell your bike, but you don't know anyone who wants to buy it. You could go door to door asking everyone, or you could go to a bike shop where buyers and sellers meet. The bike shop (like a stock exchange) makes it easy — you bring your bike, someone who wants a bike comes in, and the shop helps you make the trade!"
      },
      {
        title: "Why Exchanges Matter",
        content: "Exchanges provide a central place where trading happens, which makes markets more efficient. They also set rules and standards that everyone follows, which helps protect investors. Without exchanges, buying and selling stocks would be much more complicated and risky.",
      }
    ],
    checkQuestion: {
      question: "Why is a marketplace important?",
      hint: "Think about what would happen if you wanted to buy something but there was no store or marketplace — how would you find sellers?"
    },
    quiz: [
      {
        id: "ex1",
        question: "What is a stock exchange?",
        options: ["A type of stock", "A place where stocks are bought and sold", "A company that makes stocks", "A government agency"],
        correctAnswer: 1,
        explanation: "A stock exchange is a marketplace where stocks are bought and sold. Examples include NYSE and NASDAQ."
      },
      {
        id: "ex2",
        question: "What do stock exchanges do?",
        options: ["Create new companies", "Help match buyers and sellers of stocks", "Set stock prices", "Guarantee profits"],
        correctAnswer: 1,
        explanation: "Stock exchanges help match buyers and sellers, making it easy for people to trade stocks. They provide a central marketplace where trading happens."
      },
      {
        id: "ex3",
        question: "Why is a marketplace important?",
        options: ["Because it's required by law", "Because it makes it easier for buyers and sellers to find each other and make trades", "Because it guarantees good prices", "Because it's free"],
        correctAnswer: 1,
        explanation: "A marketplace is important because it brings buyers and sellers together in one place, making it much easier to find someone to trade with than if you had to search on your own."
      }
    ]
  },
  portfolio: {
    icon: Briefcase,
    title: "What Is a Portfolio?",
    color: "accent",
    sections: [
      {
        title: "What Is a Portfolio?",
        content: "A portfolio is all your investments together. It's like a collection that includes stocks, ETFs, bonds, cash, and any other investments you own. Balance matters more than individual picks — having a mix of different investments helps protect you from big losses. Portfolios change over time as you add new investments, sell others, or as their values go up and down.",
        analogy: "Think of a portfolio like a backpack full of different snacks for a long trip. You might have some chips, some fruit, some cookies, and some water. If one snack gets crushed or goes bad, you still have other snacks to eat. A portfolio works the same way — if one investment goes down, others might go up, keeping you fed (financially) on your journey!"
      },
      {
        title: "The Scenario",
        content: "An investor owns stocks, ETFs, and cash. Losses in one area may be balanced by gains in another. For example, if tech stocks go down but healthcare stocks go up, the portfolio might still do okay overall. This is why the whole portfolio is more important than any single investment — it's the total that matters, not each individual piece.",
        analogy: "Imagine you're playing a game where you have to collect different colored marbles. You have red, blue, and green marbles. If you lose some red ones, but gain more blue and green ones, you might still have the same total number of marbles. Your portfolio works similarly — losing in one area doesn't mean you're losing overall if other areas are doing well."
      },
      {
        title: "Why the Whole Portfolio Matters",
        content: "The whole portfolio is more important than one stock because diversification protects you. One stock might go down 50%, but if it's only 5% of your portfolio, you've only lost 2.5% overall. Meanwhile, other investments might be going up. This is why smart investors focus on their entire portfolio, not just individual stocks.",
      }
    ],
    checkQuestion: {
      question: "Why is the whole portfolio more important than one stock?",
      hint: "Think about what happens if one investment goes down — does it affect everything, or just part of your portfolio?"
    },
    quiz: [
      {
        id: "p1",
        question: "What is a portfolio?",
        options: ["A single stock", "All your investments together", "A type of bank account", "A trading strategy"],
        correctAnswer: 1,
        explanation: "A portfolio is all your investments together — stocks, ETFs, bonds, cash, and any other investments you own."
      },
      {
        id: "p2",
        question: "Why might losses in one area be balanced by gains in another?",
        options: ["Because all investments always go up", "Because a portfolio contains different investments that can move in different directions", "Because losses are illegal", "Because you can only lose money"],
        correctAnswer: 1,
        explanation: "A portfolio contains different investments that can move independently. If one goes down, others might go up, balancing out the overall result."
      },
      {
        id: "p3",
        question: "Why is the whole portfolio more important than one stock?",
        options: ["Because one stock doesn't matter", "Because diversification protects you — one stock going down doesn't mean your whole portfolio is down", "Because portfolios are always profitable", "Because you can only own one stock"],
        correctAnswer: 1,
        explanation: "The whole portfolio matters more because if one stock goes down, it's only part of your total investments. Other investments might be going up, so your overall portfolio might still be doing well."
      }
    ]
  },
  rebalancing: {
    icon: RefreshCw,
    title: "Rebalancing a Portfolio",
    color: "accent",
    sections: [
      {
        title: "What Is Rebalancing?",
        content: "Over time, some investments grow faster than others. This means your portfolio can become unbalanced — you might end up with too much in one area and too little in another. Rebalancing adjusts the portfolio back to balance by selling some of what grew too much and buying more of what grew less. It helps manage risk by keeping your portfolio diversified.",
        analogy: "Think of rebalancing like organizing your closet. Over time, you might buy more shirts than pants, so your closet becomes unbalanced. Rebalancing is like going through your closet, putting some shirts away, and buying more pants to get back to a good balance. Your portfolio works the same way — you adjust it to keep the right mix!"
      },
      {
        title: "The Scenario",
        content: "Tech stocks grow quickly. The portfolio becomes risky because now too much money is in tech stocks. If tech stocks crash, the investor could lose a lot. The investor rebalances by selling some tech stocks and buying other types of investments. This brings the portfolio back to a safer, more balanced mix.",
        analogy: "Imagine you're making a fruit salad. You start with equal amounts of apples, oranges, and bananas. But the apples grow bigger while the oranges and bananas stay the same. Now your salad is mostly apples! Rebalancing is like cutting some apples and adding more oranges and bananas to get back to a balanced mix."
      },
      {
        title: "Why Balance Changes Over Time",
        content: "Balance changes over time because different investments grow at different rates. A stock that doubles in value will take up more of your portfolio. An investment that stays the same will become a smaller percentage. This is natural, but it can make your portfolio riskier if one type of investment becomes too dominant. Rebalancing helps you maintain the risk level you want.",
      }
    ],
    checkQuestion: {
      question: "Why might balance change over time?",
      hint: "Think about what happens when one investment grows faster than others — does it take up more or less of your portfolio?"
    },
    quiz: [
      {
        id: "rb1",
        question: "What is rebalancing?",
        options: ["Buying only one stock", "Adjusting the portfolio back to balance by selling some investments and buying others", "Selling everything", "Never changing your portfolio"],
        correctAnswer: 1,
        explanation: "Rebalancing is adjusting your portfolio back to balance by selling some of what grew too much and buying more of what grew less, helping manage risk."
      },
      {
        id: "rb2",
        question: "Why might an investor rebalance when tech stocks grow quickly?",
        options: ["Because tech stocks are always bad", "Because the portfolio becomes risky with too much in one area", "Because rebalancing is required by law", "Because tech stocks always crash"],
        correctAnswer: 1,
        explanation: "When one type of investment grows quickly, it can make the portfolio unbalanced and riskier. Rebalancing helps maintain a safer, more diversified mix."
      },
      {
        id: "rb3",
        question: "Why might balance change over time?",
        options: ["Because all investments grow at the same rate", "Because different investments grow at different rates, so some become a larger percentage of the portfolio", "Because balance never changes", "Because you always sell everything"],
        correctAnswer: 1,
        explanation: "Balance changes because different investments grow at different rates. An investment that doubles will take up more of your portfolio, while slower-growing investments become a smaller percentage."
      }
    ]
  },
  responsible: {
    icon: AlertTriangle,
    title: "Responsible Investing",
    color: "accent",
    sections: [
      {
        title: "Understanding Risk and Responsibility",
        content: "Investing involves risk and responsibility. No one can predict the market perfectly — not experts, not computers, not anyone. Every investment has the possibility of losing money. Learning matters more than winning because understanding how investing works helps you make better decisions, even when things don't go as planned.",
        analogy: "Think of investing like learning to ride a bike. You might fall sometimes, but each fall teaches you something. The goal isn't to never fall — it's to learn how to balance, steer, and handle bumps. In investing, losses happen, but learning from them helps you become a better investor over time."
      },
      {
        title: "The Scenario",
        content: "Someone promises guaranteed profits. This is unrealistic and risky. In real investing, there are no guarantees. Anyone who promises you'll definitely make money is either lying or doesn't understand how investing works. Real investments can go up or down, and that's normal. Promises of guaranteed profits are a warning sign that something isn't right.",
        analogy: "Imagine someone promises you'll definitely win every game you play. That's impossible! Sometimes you win, sometimes you lose — that's how games work. Investing is similar — sometimes your investments go up, sometimes they go down. Anyone who promises you'll always win is making an impossible promise."
      },
      {
        title: "Why Guarantees Are Warning Signs",
        content: "Guarantees are warning signs because real investing always involves risk. If someone could guarantee profits, everyone would be rich! The fact that they're promising something impossible suggests they might be trying to trick you. Responsible investors understand that there are no guarantees, only probabilities and risks that need to be managed.",
      }
    ],
    checkQuestion: {
      question: "Why are guarantees a warning sign?",
      hint: "Think about whether anyone can really guarantee that investments will always make money — is that possible in the real world?"
    },
    quiz: [
      {
        id: "ri1",
        question: "What is true about investing?",
        options: ["It's always profitable", "It involves risk and responsibility, and no one can predict the market perfectly", "Guarantees are common", "You can never lose money"],
        correctAnswer: 1,
        explanation: "Investing involves risk and responsibility. No one can predict the market perfectly, and there are no guarantees. Every investment has the possibility of losing money."
      },
      {
        id: "ri2",
        question: "What should you think if someone promises guaranteed profits?",
        options: ["It's a great opportunity", "It's unrealistic and risky — a warning sign", "It's normal in investing", "It's required by law"],
        correctAnswer: 1,
        explanation: "Promises of guaranteed profits are unrealistic and risky. In real investing, there are no guarantees. Anyone who promises you'll definitely make money is either lying or doesn't understand how investing works."
      },
      {
        id: "ri3",
        question: "Why are guarantees a warning sign?",
        options: ["Because guarantees are illegal", "Because real investing always involves risk, so guarantees are impossible", "Because everyone gets guarantees", "Because guarantees are too good"],
        correctAnswer: 1,
        explanation: "Guarantees are warning signs because real investing always involves risk. If someone could guarantee profits, everyone would be rich! The fact that they're promising something impossible suggests they might be trying to trick you."
      }
    ]
  },
  notinvesting: {
    icon: X,
    title: "What Investing Is NOT",
    color: "accent",
    sections: [
      {
        title: "Investing Is Not Gambling",
        content: "Investing is not gambling. Gambling is based on pure chance with no way to improve your odds through research or learning. Investing is based on understanding companies, markets, and making informed decisions. While both involve risk, investing gives you tools to manage that risk through research, diversification, and patience. Investing requires patience and understanding, not just luck.",
        analogy: "Think of the difference between playing a slot machine and learning to play chess. A slot machine is pure chance — you pull the lever and hope. Chess requires learning strategies, understanding your opponent, and making thoughtful moves. Investing is like chess — you can learn and improve. Gambling is like the slot machine — it's just chance."
      },
      {
        title: "Investing Is Not a Shortcut",
        content: "Investing is not a shortcut to quick money. Real investing takes time. Companies grow over years, not days. People who try to get rich quick often lose money because they're not being patient or doing proper research. Someone buys stocks based on hype, thinking they'll get rich fast. They lose money quickly because they're not investing — they're speculating or gambling.",
        analogy: "Imagine trying to grow a tree by watering it once and expecting it to be full-grown the next day. That's impossible! Trees take years to grow. Investing is similar — it takes time for investments to grow. Trying to get rich quick is like expecting that tree to grow overnight. It just doesn't work that way."
      },
      {
        title: "The Scenario",
        content: "Someone buys stocks based on hype. They hear everyone talking about a stock and buy it without understanding the company. They lose money quickly because they're following the crowd, not making informed decisions. This is what investing is NOT — it's not about following trends or buying based on excitement. Real investing is about research, patience, and understanding what you're buying.",
      }
    ],
    checkQuestion: {
      question: "How is investing different from gambling?",
      hint: "Think about what you can control in each — can you learn and improve your chances in investing, or is it just pure luck?"
    },
    quiz: [
      {
        id: "ni1",
        question: "What is investing NOT?",
        options: ["A way to grow money over time", "Gambling or a shortcut to quick money", "A way to own part of companies", "A long-term strategy"],
        correctAnswer: 1,
        explanation: "Investing is not gambling or a shortcut to quick money. It requires patience, understanding, and research. Real investing takes time and is based on informed decisions, not chance or hype."
      },
      {
        id: "ni2",
        question: "What happens when someone buys stocks based on hype?",
        options: ["They always make money", "They often lose money quickly because they're not making informed decisions", "It's the best way to invest", "Hype guarantees profits"],
        correctAnswer: 1,
        explanation: "Buying stocks based on hype is not real investing — it's speculating or gambling. People who do this often lose money quickly because they're following trends instead of doing research and making informed decisions."
      },
      {
        id: "ni3",
        question: "How is investing different from gambling?",
        options: ["They're the same thing", "Investing is based on research and understanding, while gambling is based on pure chance", "Gambling is safer", "Investing always loses money"],
        correctAnswer: 1,
        explanation: "Investing is different from gambling because investing is based on research, understanding companies and markets, and making informed decisions. Gambling is based on pure chance with no way to improve your odds through learning."
      }
    ]
  },
  company: {
    icon: Building2,
    title: "What is a Company?",
    color: "primary",
    sections: [
      {
        title: "Companies Create Value",
        content: "A company is a group of people working together to create something valuable — like products or services that people want to buy. When a company makes something people need, they're willing to pay for it!",
        analogy: "Think of a lemonade stand. You buy lemons, sugar, and cups. You mix them to create lemonade. People walking by want refreshing drinks, so they pay you for your lemonade. You've created value by turning simple ingredients into something people want!"
      },
      {
        title: "How Companies Make Money",
        content: "Companies earn money (called revenue) when customers buy their products or services. But they also have costs — like paying employees, buying materials, and renting buildings. The money left over after paying all costs is called profit.",
        analogy: "Back to the lemonade stand: if you sell 20 cups for $1 each, you earn $20. But you spent $5 on lemons and sugar. Your profit is $15 — that's what you actually get to keep!"
      },
      {
        title: "Why Companies Matter",
        content: "Companies are important because they create jobs, make products we use every day, and drive innovation. From the phone in your pocket to the food at your grocery store — companies made all of it!",
      }
    ],
    checkQuestion: {
      question: "If a company sells 100 products for $10 each but spends $500 on materials and $200 on other costs, is the company making a profit? Explain your thinking.",
      hint: "Try calculating total revenue (how much they earned) first, then subtract all costs."
    },
    quiz: [
      {
        id: "c1",
        question: "What is the money a company earns from selling products called?",
        options: ["Profit", "Revenue", "Expenses", "Value"],
        correctAnswer: 1,
        explanation: "Revenue is the total money earned from sales. Profit is what's left after subtracting costs from revenue."
      },
      {
        id: "c2",
        question: "If a lemonade stand sells 50 cups at $2 each and spends $30 on supplies, what's the profit?",
        options: ["$50", "$70", "$100", "$30"],
        correctAnswer: 1,
        explanation: "Revenue = 50 × $2 = $100. Profit = $100 - $30 = $70. Great math!"
      },
      {
        id: "c3",
        question: "Why do companies exist?",
        options: ["Only to make owners rich", "To create value by making products or services people want", "Just to give people jobs", "Because the government requires them"],
        correctAnswer: 1,
        explanation: "Companies create value by providing products or services that people need. Jobs and profits are results of successfully creating value."
      }
    ]
  },
  stock: {
    icon: TrendingUp,
    title: "What is a Stock?",
    color: "secondary",
    sections: [
      {
        title: "Owning a Piece of a Company",
        content: "A stock represents a tiny piece of ownership in a company. When you own a stock, you own a small fraction of everything that company has — its buildings, products, ideas, and profits!",
        analogy: "Imagine if you and 99 friends bought a pizza shop together. Each of you would own 1% of the shop. When the shop makes money, you get 1% of the profits. A stock works the same way, but with much smaller pieces!"
      },
      {
        title: "Why Stock Prices Change",
        content: "Stock prices go up when more people want to buy than sell — and down when more people want to sell than buy. If people think a company will do well in the future, they want to own part of it, so the price goes up.",
        analogy: "Think of trading cards. If everyone wants a rare card, its price goes up because it's in demand. If a card becomes less popular, its price drops. Stock prices work the same way!"
      },
      {
        title: "Stocks Are Not the Company",
        content: "Here's something important: a stock's price isn't the same as how good a company is. A $10 stock isn't worse than a $100 stock. The price depends on how many pieces the company is divided into!",
      }
    ],
    checkQuestion: {
      question: "Why might a stock price go up even if the company hasn't changed anything recently?",
      hint: "Think about what causes prices to change — it's about what people believe will happen, not just what's happening now."
    },
    quiz: [
      {
        id: "s1",
        question: "What does owning a stock mean?",
        options: ["You work for the company", "You own a small piece of the company", "You can control the company", "You loaned money to the company"],
        correctAnswer: 1,
        explanation: "A stock represents ownership. When you buy a stock, you become a partial owner of that company!"
      },
      {
        id: "s2",
        question: "What makes a stock price go up?",
        options: ["The company paints its building", "More people want to buy the stock than sell it", "The CEO gets a raise", "Nothing — stock prices never change"],
        correctAnswer: 1,
        explanation: "Stock prices are driven by supply and demand. When more people want to buy, prices rise!"
      },
      {
        id: "s3",
        question: "A $50 stock is always better than a $10 stock. True or false?",
        options: ["True — higher price means better company", "False — price depends on how many shares exist", "True — expensive things are always better", "False — lower prices are always better"],
        correctAnswer: 1,
        explanation: "Stock price alone doesn't tell you if a company is good. It depends on how many shares exist and what the company is worth in total."
      }
    ]
  },
  marketcap: {
    icon: PieChart,
    title: "What is Market Cap?",
    color: "accent",
    sections: [
      {
        title: "Measuring a Company's Total Value",
        content: "Market cap (short for market capitalization) tells you the total value of a company based on its stock price. It's calculated by multiplying the stock price by the total number of shares.",
        analogy: "If that pizza shop is divided into 1,000 shares and each share is worth $10, the whole shop is worth $10,000. That's the market cap!"
      },
      {
        title: "Why Price Alone Is Misleading",
        content: "A company with a $500 stock price might be worth less than a company with a $50 stock price! It all depends on how many shares exist. Market cap helps you compare companies fairly.",
        analogy: "Two pizzas cost the same — $12 each. One is cut into 6 slices ($2 per slice) and one is cut into 12 slices ($1 per slice). The price per slice is different, but the total pizza value is the same!"
      },
      {
        title: "Big, Medium, and Small Companies",
        content: "We often describe companies by their market cap: 'large-cap' companies are worth over $10 billion, 'mid-cap' companies are $2-10 billion, and 'small-cap' companies are under $2 billion.",
      }
    ],
    checkQuestion: {
      question: "Company A has 1,000 shares at $50 each. Company B has 10,000 shares at $10 each. Which company is worth more? Show your work!",
      hint: "Calculate the market cap for each company by multiplying shares × price."
    },
    quiz: [
      {
        id: "m1",
        question: "How do you calculate market cap?",
        options: ["Revenue minus costs", "Stock price × number of shares", "Number of employees × salary", "Company age × profit"],
        correctAnswer: 1,
        explanation: "Market cap = stock price × total shares outstanding. It tells you the total market value of a company."
      },
      {
        id: "m2",
        question: "Company A: 500 shares at $20 each. Company B: 1000 shares at $8 each. Which is worth more?",
        options: ["Company A ($10,000)", "Company B ($8,000)", "They're equal", "Can't tell from this info"],
        correctAnswer: 0,
        explanation: "Company A: 500 × $20 = $10,000. Company B: 1000 × $8 = $8,000. Company A has a higher market cap!"
      },
      {
        id: "m3",
        question: "A 'large-cap' company is worth at least:",
        options: ["$1 million", "$100 million", "$1 billion", "$10 billion"],
        correctAnswer: 3,
        explanation: "Large-cap companies are worth over $10 billion. These are often household names you'd recognize!"
      }
    ]
  },
  diversification: {
    icon: Scale,
    title: "What is Diversification?",
    color: "success",
    sections: [
      {
        title: "Don't Put All Eggs in One Basket",
        content: "Diversification means spreading your investments across different companies, industries, or types of assets. The idea is simple: if one investment goes down, others might go up, balancing out your overall results.",
        analogy: "Imagine carrying eggs to your kitchen. If you put all 12 eggs in one basket and drop it — you lose everything! But if you use 4 baskets with 3 eggs each, dropping one basket only loses 3 eggs."
      },
      {
        title: "How Diversification Protects You",
        content: "Different companies and industries face different challenges. A tech company might struggle when a food company thrives. By owning both, you're protected no matter what happens to either one.",
        analogy: "Think about having different friends for different activities. Your soccer friend might be busy, but your movie friend is free. Diversification in friendships means you always have someone to hang out with!"
      },
      {
        title: "The Trade-off",
        content: "Here's the honest truth: diversification also means you might miss out on big gains. If you only owned the one stock that went up 100%, you'd be rich! But you'd also be at risk if it went down 100%. Diversification trades huge wins for more stability.",
      }
    ],
    checkQuestion: {
      question: "If you could only invest in 3 companies, would you pick 3 tech companies or 1 tech, 1 food, and 1 healthcare company? Explain why.",
      hint: "Think about what happens if the tech industry has a bad year."
    },
    quiz: [
      {
        id: "d1",
        question: "What does diversification mean in investing?",
        options: ["Buying only one stock you really like", "Spreading investments across different companies/industries", "Selling all your investments", "Only investing in big companies"],
        correctAnswer: 1,
        explanation: "Diversification means spreading out your investments so you don't lose everything if one goes down."
      },
      {
        id: "d2",
        question: "Why is diversification sometimes called 'not putting all eggs in one basket'?",
        options: ["Because eggs are a good investment", "Because if you drop one basket, you don't lose everything", "Because baskets are expensive", "Because eggs represent money"],
        correctAnswer: 1,
        explanation: "If all your eggs (investments) are in one basket (company) and you drop it, you lose everything. Spreading them out protects you!"
      },
      {
        id: "d3",
        question: "What's a downside of diversification?",
        options: ["It's too expensive", "You might miss out on big gains from one winner", "It's illegal", "It always loses money"],
        correctAnswer: 1,
        explanation: "While diversification protects you from big losses, it also means you won't get huge gains if one stock does extremely well."
      }
    ]
  },
  etf: {
    icon: Brain,
    title: "What is an ETF?",
    color: "warning",
    sections: [
      {
        title: "A Bundle of Stocks",
        content: "ETF stands for Exchange-Traded Fund. Think of it as a basket that holds many different stocks. When you buy one share of an ETF, you're actually buying tiny pieces of all the companies inside it!",
        analogy: "It's like buying a variety pack of candy instead of individual bars. One purchase gives you a taste of everything — chocolate, gummy bears, lollipops — without having to buy each one separately!"
      },
      {
        title: "Instant Diversification",
        content: "ETFs make diversification easy. Instead of buying 500 different stocks yourself, you can buy one S&P 500 ETF that holds all 500 for you. This saves time, effort, and often money.",
        analogy: "Imagine trying to bake a cake from scratch — buying flour, eggs, sugar separately. Or you could buy a cake mix that has everything measured and ready. ETFs are like the cake mix of investing!"
      },
      {
        title: "Different Types of ETFs",
        content: "There are ETFs for almost everything: tech companies, healthcare, international stocks, even specific themes like clean energy. Each ETF follows a specific strategy or group of companies.",
      }
    ],
    checkQuestion: {
      question: "Why might someone choose to buy an ETF instead of picking individual stocks themselves?",
      hint: "Think about time, effort, risk, and diversification."
    },
    quiz: [
      {
        id: "e1",
        question: "What does ETF stand for?",
        options: ["Easy Trading Fund", "Exchange-Traded Fund", "Electronic Transfer Fee", "Every Transaction Free"],
        correctAnswer: 1,
        explanation: "ETF stands for Exchange-Traded Fund — a fund you can buy and sell on stock exchanges."
      },
      {
        id: "e2",
        question: "How does an ETF provide diversification?",
        options: ["By only holding one stock", "By holding many different stocks in one package", "By trading very fast", "By being expensive"],
        correctAnswer: 1,
        explanation: "An ETF holds many stocks, so buying one ETF share gives you exposure to all of them at once!"
      },
      {
        id: "e3",
        question: "An S&P 500 ETF holds stocks from how many companies?",
        options: ["5", "50", "500", "5000"],
        correctAnswer: 2,
        explanation: "The S&P 500 is an index of 500 large US companies. An S&P 500 ETF holds all of them!"
      }
    ]
  },
  // New lessons
  risk: {
    icon: Shield,
    title: "Understanding Risk",
    color: "destructive",
    sections: [
      {
        title: "What is Investment Risk?",
        content: "Risk means the chance that you could lose some or all of your money. Every investment has some level of risk — even keeping cash under your mattress (it could get stolen or lose value to inflation).",
        analogy: "Think of riding a bike. Going slow on a flat path is low risk — you probably won't fall. Racing downhill is high risk — exciting, but you might crash! Investing works the same way."
      },
      {
        title: "Risk and Reward Are Connected",
        content: "Generally, higher risk investments have the potential for higher rewards, but also bigger losses. Lower risk investments are safer but usually grow more slowly. This is called the risk-reward trade-off.",
        analogy: "It's like carnival games. The easy game gives small prizes. The hard game could win you a giant teddy bear — or nothing at all!"
      },
      {
        title: "Managing Your Risk",
        content: "Smart investors don't avoid risk completely — they manage it. This means understanding how much risk you can handle, diversifying your investments, and not investing money you'll need soon.",
      }
    ],
    checkQuestion: {
      question: "Why would someone choose a lower-risk investment even if it grows more slowly?",
      hint: "Think about when someone might need their money back."
    },
    quiz: [
      {
        id: "r1",
        question: "What does 'risk' mean in investing?",
        options: ["Guaranteed profit", "The chance you could lose money", "A type of stock", "A trading strategy"],
        correctAnswer: 1,
        explanation: "Risk is the possibility that you could lose some or all of your investment."
      },
      {
        id: "r2",
        question: "What is the risk-reward trade-off?",
        options: ["You can eliminate all risk", "Higher risk usually means potential for higher rewards (and losses)", "Low risk gives high rewards", "Risk and reward aren't connected"],
        correctAnswer: 1,
        explanation: "Higher risk investments can give bigger gains, but also bigger losses. It's a trade-off!"
      },
      {
        id: "r3",
        question: "Which is generally considered lower risk?",
        options: ["A single small company stock", "Government bonds", "Cryptocurrency", "A startup investment"],
        correctAnswer: 1,
        explanation: "Government bonds are backed by the government and are considered very low risk compared to individual stocks or crypto."
      }
    ]
  },
  compound: {
    icon: Clock,
    title: "The Magic of Compound Growth",
    color: "accent",
    sections: [
      {
        title: "What is Compound Growth?",
        content: "Compound growth is when you earn returns not just on your original investment, but also on the returns you've already earned. It's like a snowball rolling downhill — it gets bigger and bigger!",
        analogy: "Imagine you plant one apple tree. It gives you 10 apples. You plant seeds from those apples and get 10 more trees. Now you have 11 trees giving you 110 apples! That's compounding."
      },
      {
        title: "Time is Your Superpower",
        content: "The longer you invest, the more time compound growth has to work its magic. Starting early — even with small amounts — can lead to amazing results over decades.",
        analogy: "If you fold a piece of paper in half 42 times (theoretically), it would reach the moon! Each fold doubles the thickness. That's the power of compounding over time."
      },
      {
        title: "The Rule of 72",
        content: "Want to know how long it takes to double your money? Divide 72 by your annual return percentage. If you earn 8% per year, it takes about 9 years to double (72 ÷ 8 = 9).",
      }
    ],
    checkQuestion: {
      question: "Why is it better to start investing at age 20 than age 40, even if you invest the same total amount?",
      hint: "Think about how long compound growth has to work in each case."
    },
    quiz: [
      {
        id: "cg1",
        question: "What makes compound growth special?",
        options: ["You only earn on your original investment", "You earn returns on your returns", "It only works with large amounts", "It's the same as simple interest"],
        correctAnswer: 1,
        explanation: "Compound growth means earning returns on both your original investment AND your previous returns!"
      },
      {
        id: "cg2",
        question: "According to the Rule of 72, if you earn 6% per year, how long to double your money?",
        options: ["6 years", "12 years", "18 years", "72 years"],
        correctAnswer: 1,
        explanation: "72 ÷ 6 = 12 years. The Rule of 72 is a quick way to estimate doubling time!"
      },
      {
        id: "cg3",
        question: "Who benefits more from compound growth?",
        options: ["Someone who invests $1000 at age 40", "Someone who invests $1000 at age 20", "Both benefit equally", "Neither benefits from compounding"],
        correctAnswer: 1,
        explanation: "Starting at 20 gives 20 extra years for compound growth to work! Time is the secret ingredient."
      }
    ]
  },
  savings: {
    icon: Wallet,
    title: "Saving vs. Investing",
    color: "success",
    sections: [
      {
        title: "What's the Difference?",
        content: "Saving means putting money aside in a safe place, like a bank account. Investing means using money to buy things (like stocks) that might grow in value. Both are important, but they serve different purposes.",
        analogy: "Saving is like storing food in your refrigerator — it's safe and ready when you need it. Investing is like planting a garden — it takes time, has some risk, but could give you much more food later!"
      },
      {
        title: "When to Save",
        content: "Save money you'll need soon — like for an emergency fund, a vacation, or something you're planning to buy within a few years. Savings accounts are safe but don't grow much.",
        analogy: "Keep your umbrella savings handy for rainy days. You wouldn't want your emergency money locked up in something risky!"
      },
      {
        title: "When to Invest",
        content: "Invest money you won't need for many years — like for retirement or long-term goals. Investing has more risk, but over long periods, it historically grows more than savings accounts.",
      }
    ],
    checkQuestion: {
      question: "Should your emergency fund be in savings or investments? Why?",
      hint: "Think about when you might need emergency money and how quickly you'd need access to it."
    },
    quiz: [
      {
        id: "sv1",
        question: "What's the main difference between saving and investing?",
        options: ["There is no difference", "Saving is safer but grows slowly; investing has risk but can grow more", "Saving always loses money", "Investing is completely safe"],
        correctAnswer: 1,
        explanation: "Saving is low risk/low reward. Investing has more risk but potential for higher growth over time."
      },
      {
        id: "sv2",
        question: "Where should you keep money you need for an emergency?",
        options: ["All in stocks", "In a savings account", "Under your bed", "In cryptocurrency"],
        correctAnswer: 1,
        explanation: "Emergency funds should be easily accessible and safe — a savings account is perfect for this!"
      },
      {
        id: "sv3",
        question: "Money for retirement (30+ years away) is best:",
        options: ["Kept in cash", "Invested for growth", "Spent now", "Hidden in a safe"],
        correctAnswer: 1,
        explanation: "Long-term money benefits from investing because you have time to ride out ups and downs and let compound growth work."
      }
    ]
  },
  news: {
    icon: BarChart3,
    title: "How News Affects Stocks",
    color: "secondary",
    sections: [
      {
        title: "News Moves Markets",
        content: "Stock prices often change based on news. Good news about a company (strong sales, new products) usually makes its stock price rise. Bad news (lawsuits, falling sales) often makes prices fall.",
        analogy: "It's like your favorite sports team. When they win, more people want team merchandise. When they lose, interest drops. Companies work similarly!"
      },
      {
        title: "Not All News is Equal",
        content: "Some news is more important than others. Earnings reports (how much money a company made) are major events. A CEO leaving is big news. A small lawsuit might barely move the stock.",
        analogy: "Getting an A on a pop quiz is nice, but getting an A on the final exam matters much more for your grade!"
      },
      {
        title: "The Market Already Knows",
        content: "Often, stock prices move BEFORE news is officially announced because investors predict what might happen. When the news comes out, the price might not move much if it was expected.",
      }
    ],
    checkQuestion: {
      question: "If everyone expects a company to report great earnings and they do, why might the stock price not go up?",
      hint: "Think about whether the good news was already 'priced in' to the stock."
    },
    quiz: [
      {
        id: "n1",
        question: "A company announces record sales. What usually happens to its stock?",
        options: ["Price goes down", "Price goes up", "Price never changes from news", "The company closes"],
        correctAnswer: 1,
        explanation: "Good news like record sales usually makes more people want to own the stock, pushing the price up!"
      },
      {
        id: "n2",
        question: "Why might a stock not rise after good news is announced?",
        options: ["Good news never helps", "Investors already expected it (it was 'priced in')", "News doesn't affect stocks", "The market was closed"],
        correctAnswer: 1,
        explanation: "If everyone already expected good news, the price rose before the announcement. No surprise = no new price movement."
      },
      {
        id: "n3",
        question: "Which news would likely impact a stock price the most?",
        options: ["The CEO's birthday", "The company's quarterly earnings report", "A small employee promotion", "The company's logo color change"],
        correctAnswer: 1,
        explanation: "Earnings reports show how much money a company made — that's crucial information that moves stock prices!"
      }
    ]
  }
};

const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const { toast } = useToast();

  const lesson = lessonId ? lessonsContent[lessonId] : null;

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
            <Link to="/learn">
              <Button>Back to Lessons</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = lesson.icon;
  const section = lesson.sections[currentSection];
  const isLastSection = currentSection === lesson.sections.length - 1;

  const colorClasses: Record<string, string> = {
    primary: "bg-primary-light text-primary",
    secondary: "bg-secondary-light text-secondary",
    accent: "bg-accent-lighter text-accent",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const systemPrompt = `You are a friendly and encouraging AI tutor for StockSchool, an educational platform about the stock market. Your role is to provide constructive feedback on student answers to concept check questions.

Guidelines:
- Be encouraging and positive
- Acknowledge what the student got right
- Gently guide them if they're missing something important
- Keep feedback concise (2-3 sentences)
- End with encouragement to continue learning
- Focus on the key concepts from the lesson`;

      const userPrompt = `Lesson: "${lesson?.title}"
Question: "${lesson?.checkQuestion.question}"
Hint: "${lesson?.checkQuestion.hint}"

Student's Answer: "${answer}"

Please provide brief, encouraging feedback on this answer. Focus on whether they understood the key concept and gently guide them if needed.`;

      const aiFeedback = await callOpenAI(systemPrompt, userPrompt, 300);
      setFeedback(aiFeedback);
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get feedback. Please try again.",
        variant: "destructive",
      });
      // Fallback feedback
      setFeedback(
        "Great thinking! You're on the right track. Keep exploring these concepts — that's how real learning happens!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizComplete = () => {
    setQuizComplete(true);
    setShowQuiz(false);
  };

  // Determine which lessons are available
  const lessonIds = Object.keys(lessonsContent);
  const currentIndex = lessonIds.indexOf(lessonId || "");
  const nextLessonId = currentIndex < lessonIds.length - 1 ? lessonIds[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Progress Bar */}
        <div className="border-b border-border bg-card">
          <div className="container py-4">
            <div className="flex items-center justify-between mb-2">
              <Link to="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Lessons
              </Link>
              <span className="text-sm text-muted-foreground">
                {showQuiz ? "Quiz" : showQuestion ? "Concept Check" : `Part ${currentSection + 1} of ${lesson.sections.length}`}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ 
                  width: showQuiz || quizComplete
                    ? '100%' 
                    : showQuestion 
                      ? '85%' 
                      : `${((currentSection + 1) / (lesson.sections.length + 2)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <section className="py-12">
          <div className="container max-w-3xl">
            {showQuiz ? (
              <div className="animate-slide-up">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colorClasses[lesson.color]}`}>
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Knowledge Check</p>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Quiz Time!
                    </h1>
                  </div>
                </div>
                <LessonQuiz 
                  questions={lesson.quiz} 
                  lessonTitle={lesson.title}
                  onComplete={handleQuizComplete}
                />
              </div>
            ) : quizComplete ? (
              <div className="animate-slide-up text-center py-12">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/20 mb-6">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Lesson Complete! 🎉
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  You've finished "{lesson.title}"! {nextLessonId ? "Ready to continue learning?" : "Ready to practice in the simulator?"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {nextLessonId && (
                    <Link 
                      to={`/learn/${nextLessonId}`} 
                      onClick={() => {
                        setCurrentSection(0);
                        setShowQuestion(false);
                        setShowQuiz(false);
                        setAnswer("");
                        setFeedback(null);
                        setQuizComplete(false);
                      }}
                    >
                      <Button variant="hero" size="lg" className="group">
                        Next Lesson
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                  {!nextLessonId && (
                    <Link to="/simulator">
                      <Button variant="hero" size="lg" className="group">
                        Try the Simulator
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                  <Link to="/learn">
                    <Button variant="outline" size="lg">
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      All Lessons
                    </Button>
                  </Link>
                </div>
              </div>
            ) : !showQuestion ? (
              <div className="animate-slide-up">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colorClasses[lesson.color]}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{lesson.title}</p>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {section.title}
                    </h1>
                  </div>
                </div>

                {/* Content */}
                <Card className="mb-6">
                  <CardContent className="p-8">
                    <p className="text-lg text-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>

                {/* Analogy */}
                {section.analogy && (
                  <Card variant="highlighted" className="mb-8 border-2 border-secondary/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lighter flex-shrink-0">
                          <Lightbulb className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Think of it this way...</h3>
                          <p className="text-muted-foreground leading-relaxed">{section.analogy}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(prev => prev - 1)}
                    disabled={currentSection === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {isLastSection ? (
                    <Button variant="hero" onClick={() => setShowQuestion(true)} className="group">
                      <CheckCircle2 className="h-5 w-5" />
                      Check Understanding
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <Button variant="hero" onClick={() => setCurrentSection(prev => prev + 1)} className="group">
                      Continue
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-slide-up">
                {/* Question Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-lighter">
                    <MessageCircle className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Concept Check</p>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Let's Think Together
                    </h1>
                  </div>
                </div>

                {/* Question Card */}
                <Card className="mb-6">
                  <CardContent className="p-8">
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      {lesson.checkQuestion.question}
                    </p>
                    
                    <div className="rounded-xl bg-muted/50 p-4 mb-6">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">💡 Hint:</strong> {lesson.checkQuestion.hint}
                      </p>
                    </div>

                    <Textarea
                      placeholder="Type your answer here... Don't worry about being perfect — explain your thinking!"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="min-h-[120px] mb-4"
                      disabled={!!feedback}
                    />

                    {!feedback && (
                      <Button 
                        variant="hero" 
                        onClick={handleSubmitAnswer}
                        disabled={!answer.trim() || isSubmitting}
                        className="w-full group"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* AI Feedback */}
                {feedback && (
                  <Card variant="highlighted" className="mb-8 border-2 border-success/30 animate-scale-in">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-light flex-shrink-0">
                          <Sparkles className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-success mb-2">Nice work! 🎉</h3>
                          <p className="text-muted-foreground leading-relaxed">{feedback}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Take Quiz Button */}
                {feedback && (
                  <div className="flex justify-center animate-slide-up">
                    <Button variant="hero" size="lg" onClick={() => setShowQuiz(true)} className="group">
                      Take the Quiz
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LessonDetail;
