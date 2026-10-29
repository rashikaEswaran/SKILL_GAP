// Corporate Companies, Hiring Roles, Company-Specific Assessments & GeeksforGeeks Recommendations

export const CORPORATE_COMPANIES = [
  {
    id: "google",
    name: "Google",
    tagline: "Organize the world's information and make it universally accessible",
    tier: "Tier-1 Tech Giant (FAANG / MAANG)",
    location: "Bengaluru, Hyderabad, Mountain View",
    logoColor: "from-blue-500 via-red-500 to-yellow-500",
    badge: "MAANG Tier-1",
    badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    description: "World leader in Search, Cloud Infrastructure, Machine Learning, and Distributed Computing.",
    gfgArchiveUrl: "https://www.geeksforgeeks.org/google-interview-experience-and-questions/",
    gfgTagUrl: "https://www.geeksforgeeks.org/tag/google/",
    openRoles: [
      {
        id: "google-sde1",
        title: "Software Engineer I (L3)",
        department: "Core Engineering & Infrastructure",
        experience: "0 - 2 Years (Freshers / Campus Graduates Eligible)",
        workType: "Hybrid (Bengaluru / Hyderabad)",
        salaryRange: "₹24 LPA - ₹38 LPA",
        requiredSkills: ["Data Structures & Algorithms", "C++ / Java / Python", "Distributed Systems", "Operating Systems"],
        description: "Develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another at global scale.",
        assessment: {
          title: "Google Online Technical Challenge (G-OTC)",
          durationMinutes: 25,
          passThreshold: 75,
          format: "10 MCQs — DSA, OS, Distributed Systems, Concurrency, ML Basics",
          questions: [
            {
              id: "g_q1", type: "mcq",
              question: "In a distributed system running Google Spanner, what mechanism provides globally consistent linearizable reads without locking?",
              options: ["Two-Phase Locking (2PL) with Paxos","TrueTime API with GPS and Atomic Clocks providing bounded uncertainty","Vector Clocks with Gossip Protocol","Quorum Reads over Raft Consensus"],
              correctAnswer: 1,
              explanation: "Google Spanner uses the TrueTime API, bounding clock uncertainty using GPS receivers and atomic clocks to achieve external consistency."
            },
            {
              id: "g_q2", type: "mcq",
              question: "What is the tightest worst-case time complexity for finding the median of two sorted arrays of lengths M and N?",
              options: ["O(M + N)","O(log(min(M, N)))","O(log(M) * log(N))","O(min(M, N))"],
              correctAnswer: 1,
              explanation: "By binary-searching the smaller array, we find the median in O(log(min(M, N))) time."
            },
            {
              id: "g_q3", type: "mcq",
              question: "Which Linux memory model is used by Google high-throughput servers to minimize TLB misses for multi-GB allocations?",
              options: ["Demand Paging (4KB pages)","HugePages (Transparent Huge Pages — 2MB/1GB)","Virtual Memory Thrashing","Buddy Allocation with Swap Files"],
              correctAnswer: 1,
              explanation: "HugePages maps memory in 2MB or 1GB chunks, dramatically reducing TLB pressure on high-memory servers."
            },
            {
              id: "g_q4", type: "mcq",
              question: "What is the time and space complexity of Morris In-order Traversal of a binary tree?",
              options: ["O(n log n), O(n)","O(n) time, O(1) space","O(n) time, O(n) space","O(log n) time, O(1) space"],
              correctAnswer: 1,
              explanation: "Morris Traversal achieves O(n) time and O(1) extra space by temporarily threading rightmost pointers."
            },
            {
              id: "g_q5", type: "mcq",
              question: "In Google's MapReduce, what is the purpose of the Shuffle phase?",
              options: ["Compress mapped output for network transfer","Group and sort intermediate key-value pairs by key so each reducer receives all values for its key","Replicate output across HDFS blocks","Apply combiners locally before data transfer"],
              correctAnswer: 1,
              explanation: "The shuffle phase sorts and routes intermediate K-V pairs so reducers receive all values associated with their key."
            },
            {
              id: "g_q6", type: "mcq",
              question: "Which concurrency primitive best prevents the ABA problem in lock-free programming?",
              options: ["Mutex with spinlock","CAS with a version counter (tagged pointer / double-word CAS)","ReadWriteLock with fairness","Semaphore with binary count"],
              correctAnswer: 1,
              explanation: "Tagged pointers include a version number so even if a value reverts to original, the version counter differs, preventing ABA."
            },
            {
              id: "g_q7", type: "mcq",
              question: "In consistent hashing with virtual nodes, what is the primary benefit of virtual nodes?",
              options: ["Reduce network latency","Evenly distribute load and minimize data migration when nodes join/leave","Enable shard encryption","Allow servers to handle different protocols"],
              correctAnswer: 1,
              explanation: "Virtual nodes provide uniform key distribution and reduce remapping overhead when cluster topology changes."
            },
            {
              id: "g_q8", type: "mcq",
              question: "What is the output of this Python snippet?\n\ndef f(x=[]):\n    x.append(1)\n    return x\nprint(f(), f(), f())",
              options: ["[1] [1] [1]","[1] [1, 1] [1, 1, 1]","[] [] []","TypeError: mutable default argument"],
              correctAnswer: 1,
              explanation: "Default mutable arguments are shared across calls. Each call appends 1 to the same list object."
            },
            {
              id: "g_q9", type: "mcq",
              question: "Which algorithm achieves the theoretically optimal O(V log V + E) time for single-source shortest paths?",
              options: ["Bellman-Ford with queue","Dijkstra with Fibonacci Heap","A* with Manhattan heuristic","BFS with adjacency matrix"],
              correctAnswer: 1,
              explanation: "Fibonacci heaps give Dijkstra O(1) amortized decrease-key, yielding O(V log V + E) overall."
            },
            {
              id: "g_q10", type: "mcq",
              question: "In a Transformer's Multi-Head Attention, why is the dot product scaled by 1/sqrt(d_k)?",
              options: ["To reduce matrix multiplication cost","To prevent softmax saturation from large dot products causing vanishing gradients","To ensure weights sum to exactly 1","To normalize across different sequence lengths"],
              correctAnswer: 1,
              explanation: "Large dot products push softmax into saturation regions with tiny gradients. Scaling by 1/sqrt(d_k) stabilizes training."
            }
          ]
        },
        gfgRecommendations: [
          {
            title: "Top 50 Google Coding Interview Questions",
            url: "https://www.geeksforgeeks.org/top-50-google-interview-questions/",
            category: "Core DSA",
            level: "Hard"
          },
          {
            title: "Dynamic Programming in Graphs & DAG Longest Paths",
            url: "https://www.geeksforgeeks.org/longest-path-between-any-pair-of-vertices/",
            category: "Algorithms",
            level: "Advanced"
          },
          {
            title: "Google Spanner & Distributed Consistency Architecture",
            url: "https://www.geeksforgeeks.org/google-spanner-a-distributed-database/",
            category: "System Design",
            level: "Intermediate"
          }
        ]
      },
      {
        id: "google-ml-eng",
        title: "Machine Learning Software Engineer",
        department: "Google DeepMind / Search AI",
        experience: "0 - 3 Years",
        workType: "Bengaluru",
        salaryRange: "₹28 LPA - ₹42 LPA",
        requiredSkills: ["Python", "PyTorch / JAX", "Machine Learning", "Mathematics (Linear Algebra & Calculus)"],
        description: "Train, evaluate, and scale deep learning architectures and LLMs serving mission-critical user workflows.",
        assessment: {
          title: "Google AI & ML Foundations Assessment",
          durationMinutes: 25,
          passThreshold: 75,
          format: "10 MCQs — Deep Learning, Transformers, Optimization, Loss Functions & Concurrency",
          questions: [
            {
              id: "g_ml_1",
              type: "mcq",
              question: "In the Multi-Head Attention mechanism of Transformers, why is the Scaled Dot-Product scaled by sqrt(d_k)?",
              options: [
                "To reduce computational matrix multiplication time",
                "To prevent dot products from growing large in magnitude, pushing softmax into regions with extremely small gradients",
                "To ensure the attention weights sum up to exactly 1.0",
                "To normalize token embeddings across variable sequence lengths"
              ],
              correctAnswer: 1,
              explanation: "Scaling by sqrt(d_k) counteracts large dot products for higher dimensions, preventing softmax saturation and vanishing gradients during backpropagation."
            },
            {
              id: "g_ml_2",
              type: "mcq",
              question: "Which technique is most effective for preventing vanishing gradients in deep Residual Networks (ResNets)?",
              options: [
                "L1 Weight Regularization",
                "Identity Skip Connections that allow gradients to flow directly through the computational graph",
                "Sigmoid Activation Functions in intermediate layers",
                "Using large learning rates with stochastic gradient descent"
              ],
              correctAnswer: 1,
              explanation: "Skip connections allow the identity mapping to bypass convolutional layers, providing uninterrupted gradient highways back to earlier layers."
            },
            {
              id: "g_ml_3",
              type: "mcq",
              question: "How does the Adam optimizer combine the strengths of AdaGrad and RMSProp?",
              options: [
                "By using momentum on gradients (first moment) and exponentially decaying average of squared gradients (second moment)",
                "By executing Newton-Raphson second-order Hessian matrix inversion at each step",
                "By applying L1 sparsity on sparse weights and L2 weight decay on dense weights",
                "By alternating between batch gradient descent and stochastic sampling per epoch"
              ],
              correctAnswer: 0,
              explanation: "Adam calculates adaptive learning rates for each parameter by storing exponentially decaying averages of past gradients (momentum) and past squared gradients (RMSProp)."
            },
            {
              id: "g_ml_4",
              type: "mcq",
              question: "What is the primary difference in attention masking between BERT and GPT architectures?",
              options: [
                "BERT uses causal autoregressive masking, while GPT allows bidirectional self-attention",
                "BERT uses bidirectional non-causal self-attention, while GPT enforces causal (triangular) masking to prevent attending to future tokens",
                "BERT does not use positional embeddings, whereas GPT requires rotary embeddings",
                "Both use identical causal cross-attention masks"
              ],
              correctAnswer: 1,
              explanation: "BERT is an encoder-based model that attends bidirectionally to past and future context, whereas GPT is an autoregressive decoder that uses upper-triangular causal masking so tokens only attend to preceding tokens."
            },
            {
              id: "g_ml_5",
              type: "mcq",
              question: "Why does Batch Normalization behave differently during training versus inference?",
              options: [
                "During training it uses running population statistics, while during inference it computes mini-batch mean and variance",
                "During training it computes mini-batch mean and variance, while during inference it uses accumulated moving-average population statistics",
                "Batch Normalization is disabled completely during inference and replaced by Dropout",
                "It applies higher dropout rates during inference to simulate model ensembling"
              ],
              correctAnswer: 1,
              explanation: "During training, mini-batch mean and variance normalize activations. For deterministic inference on single inputs or varying batch sizes, pre-computed running population statistics are used instead."
            },
            {
              id: "g_ml_6",
              type: "mcq",
              question: "What is the derivative (gradient) of Binary Cross-Entropy loss L = -[y*log(p) + (1-y)*log(1-p)] with respect to the raw logit z when p = sigmoid(z)?",
              options: [
                "p * (1 - p)",
                "p - y",
                "(y - p) / (p * (1 - p))",
                "log(p / (1 - p))"
              ],
              correctAnswer: 1,
              explanation: "Combining the sigmoid derivative d(p)/dz = p*(1-p) with dL/dp = (p-y)/(p*(1-p)) cancels out the denominator, yielding the clean and numerically stable gradient: p - y."
            },
            {
              id: "g_ml_7",
              type: "mcq",
              question: "Which evaluation metric is invariant to classification decision threshold and robust against imbalanced class distributions?",
              options: [
                "Accuracy",
                "Mean Squared Error (MSE)",
                "Area Under the ROC Curve (ROC-AUC)",
                "Cohen's Kappa alone"
              ],
              correctAnswer: 2,
              explanation: "ROC-AUC evaluates the ranking capability across all possible decision thresholds, plotting True Positive Rate vs False Positive Rate."
            },
            {
              id: "g_ml_8",
              type: "mcq",
              question: "What is the key mechanism of Low-Rank Adaptation (LoRA) for parameter-efficient fine-tuning (PEFT) of LLMs?",
              options: [
                "Quantizing all 16-bit floating point weights into 4-bit integers",
                "Freezing base model weights and injecting trainable rank-decomposition matrices A and B (where ΔW = B × A, rank r << d)",
                "Pruning 70% of redundant attention heads based on magnitude",
                "Training only the word embedding layer while freezing all transformer blocks"
              ],
              correctAnswer: 1,
              explanation: "LoRA decomposes the weight update matrix ΔW into two low-rank matrices B (d×r) and A (r×k), drastically cutting memory and trainable parameters by over 99%."
            },
            {
              id: "g_ml_9",
              type: "mcq",
              question: "What effect does setting temperature T → 0 have on the softmax distribution P(w_i) = exp(z_i / T) / Σ exp(z_j / T) during LLM text generation?",
              options: [
                "It makes the output probability distribution completely uniform across all vocabulary tokens",
                "It collapses the distribution into a deterministic one-hot vector selecting the token with the highest logit (ArgMax / Greedy Search)",
                "It introduces random Gaussian jitter to enhance model creativity",
                "It triggers repetitive loop penalty dampening"
              ],
              correctAnswer: 1,
              explanation: "As T approaches 0, the exponential of the maximum logit dominates completely over all others, turning the softmax output into a greedy argmax selector."
            },
            {
              id: "g_ml_10",
              type: "mcq",
              question: "In distributed machine learning, what communication primitive does PyTorch DistributedDataParallel (DDP) use to aggregate gradients across all GPUs simultaneously?",
              options: [
                "Parameter Server RPC polling",
                "Ring All-Reduce",
                "Broadcast-Scatter Master Gather",
                "Shared Memory Mutex Locks"
              ],
              correctAnswer: 1,
              explanation: "Ring All-Reduce allows bandwidth-optimal gradient summation across all nodes in 2*(N-1) ring communication steps without overloading any single master node."
            }
          ]
        },
        gfgRecommendations: [
          {
            title: "Transformers & Attention Mechanism Guide",
            url: "https://www.geeksforgeeks.org/attention-mechanism-in-nlp/",
            category: "AI / ML",
            level: "Advanced"
          },
          {
            title: "Gradient Descent Optimization Algorithms",
            url: "https://www.geeksforgeeks.org/gradient-descent-algorithm-and-its-variants/",
            category: "Deep Learning",
            level: "Intermediate"
          }
        ]
      }
    ]
  },
  {
    id: "amazon",
    name: "Amazon",
    tagline: "Earth's most customer-centric company",
    tier: "Tier-1 Tech Giant (FAANG)",
    location: "Hyderabad, Bengaluru, Chennai, Seattle",
    logoColor: "from-amber-500 to-orange-600",
    badge: "FAANG Tier-1",
    badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description: "Pioneer in global Cloud Infrastructure (AWS), e-commerce microservices, and AI-driven supply chain logistics.",
    gfgArchiveUrl: "https://www.geeksforgeeks.org/amazon-interview-preparation/",
    gfgTagUrl: "https://www.geeksforgeeks.org/tag/amazon/",
    openRoles: [
      {
        id: "amazon-sde1",
        title: "Software Development Engineer I (SDE-1)",
        department: "Amazon Web Services (AWS) Platform",
        experience: "0 - 1 Years (Campus Placements / Freshers)",
        workType: "Hyderabad / Bengaluru",
        salaryRange: "₹22 LPA - ₹34 LPA",
        requiredSkills: ["Java / C++", "Object Oriented Design", "AWS Services", "Data Structures"],
        description: "Design and implement scalable microservices powering AWS services and high-volume fulfillment systems.",
        assessment: {
          title: "Amazon Online Assessment (OA-2 Style)",
          durationMinutes: 25,
          passThreshold: 70,
          format: "10 MCQs — Leadership Principles, DSA, AWS, System Design, Java/OOP",
          questions: [
            {
              id: "amz_q1", type: "mcq",
              question: "Amazon LP: You are 2 days from Prime Day and find a UI bug affecting 0.1% of edge-case browsers. What is the most 'Customer Obsession + Bias for Action' aligned response?",
              options: ["Delay entire release for full refactor","Ship stable core with isolated hotfix flag, log telemetry, monitor metrics","Ignore since <1% impact","Hand off to another team"],
              correctAnswer: 1, explanation: "Bias for Action means calculated, reversible decisions. Ship with telemetry — not delay or ignore."
            },
            {
              id: "amz_q2", type: "mcq",
              question: "Which data structure gives O(log K) updates for a real-time Top-K leaderboard under high throughput?",
              options: ["Unsorted array","Min-Heap of size K + HashMap for O(1) frequency lookup","Linked list with sort","BST without balancing"],
              correctAnswer: 1, explanation: "HashMap tracks frequencies in O(1); Min-Heap of size K maintains running top-K in O(log K) per update."
            },
            {
              id: "amz_q3", type: "mcq",
              question: "In AWS DynamoDB, which operation retrieves an item in O(1) time given its partition key and sort key?",
              options: ["Scan with FilterExpression","GetItem by primary key","Query with GlobalSecondaryIndex","BatchGet without key"],
              correctAnswer: 1, explanation: "GetItem uses the partition key + optional sort key to directly access the item in O(1) — Scan is O(n) and should be avoided."
            },
            {
              id: "amz_q4", type: "mcq",
              question: "Amazon Leadership Principle 'Dive Deep': A microservice returns wrong results intermittently. What is the correct first step?",
              options: ["Restart all services","Add structured logging at each service boundary and trace a single failing request end-to-end","Rollback to previous version immediately","Blame upstream team"],
              correctAnswer: 1, explanation: "Dive Deep means root-causing via structured traces and logs before taking action — not blind rollbacks."
            },
            {
              id: "amz_q5", type: "mcq",
              question: "What is the time complexity of the sliding window technique for finding the longest substring without repeating characters?",
              options: ["O(n²)","O(n) with two pointers and a HashSet","O(n log n)","O(n²) with HashMap"],
              correctAnswer: 1, explanation: "The sliding window with a HashSet visits each character at most twice, giving O(n) time complexity."
            },
            {
              id: "amz_q6", type: "mcq",
              question: "Which AWS service is best suited for decoupling a high-throughput order pipeline between producer and consumer microservices?",
              options: ["Amazon RDS","Amazon SQS (Simple Queue Service)","Amazon S3","Amazon CloudFront"],
              correctAnswer: 1, explanation: "SQS provides durable, scalable message queuing that decouples producer and consumer services, preventing cascading failures."
            },
            {
              id: "amz_q7", type: "mcq",
              question: "In Java, what is the difference between HashMap and ConcurrentHashMap?",
              options: ["No difference","ConcurrentHashMap uses segment-level locking / CAS for thread-safe concurrent access; HashMap is not thread-safe","HashMap is faster for all operations","ConcurrentHashMap does not allow null values or keys"],
              correctAnswer: 1, explanation: "ConcurrentHashMap allows safe concurrent reads and writes using bucket-level CAS operations, while HashMap is unsynchronized."
            },
            {
              id: "amz_q8", type: "mcq",
              question: "Amazon's 'Ownership' principle: You notice a critical bug in a library owned by another team that affects your service. What do you do?",
              options: ["Wait for the other team to fix it","Create a temporary workaround, file a detailed bug report with reproduction steps, and offer to co-own the fix","Ignore — it is not your problem","Delete your dependency on the library immediately"],
              correctAnswer: 1, explanation: "Amazon Ownership means acting beyond your job description to protect the customer experience — even across team boundaries."
            },
            {
              id: "amz_q9", type: "mcq",
              question: "What is the worst-case time complexity of QuickSort and how does Amazon's Timsort (used in Java's Arrays.sort) avoid it?",
              options: ["O(n log n) worst case — Timsort doesn't differ","O(n²) worst case for QuickSort; Timsort uses merge sort for larger partitions and insertion sort for small runs, ensuring O(n log n) always","O(n) worst case for both","O(n²) for both — Timsort only changes constant factors"],
              correctAnswer: 1, explanation: "QuickSort degrades to O(n²) with bad pivots. Timsort is a hybrid that guarantees O(n log n) by using merge for larger slices."
            },
            {
              id: "amz_q10", type: "mcq",
              question: "In Amazon's six-pager document culture, what is the purpose of writing a 'Working Backwards' PR/FAQ document before building a product?",
              options: ["To satisfy legal compliance","To start from the customer's perspective — define the press release and FAQ first to ensure the product truly solves customer needs","To estimate engineering cost","To get manager approval for headcount"],
              correctAnswer: 1, explanation: "Working Backwards forces teams to define customer value first, preventing engineering solutions looking for problems."
            }
          ]
        },
        gfgRecommendations: [
          {
            title: "Top 20 Amazon Coding Interview Questions",
            url: "https://www.geeksforgeeks.org/amazon-interview-questions/",
            category: "Coding Archives",
            level: "Intermediate - Hard"
          },
          {
            title: "Amazon Leadership Principles Interview Guide",
            url: "https://www.geeksforgeeks.org/amazon-leadership-principles-interview-questions/",
            category: "Behavioral & Culture",
            level: "Crucial"
          },
          {
            title: "Design a High-Throughput Leaderboard System",
            url: "https://www.geeksforgeeks.org/design-a-real-time-leaderboard-system/",
            category: "System Design",
            level: "Intermediate"
          }
        ]
      }
    ]
  },
  {
    id: "zoho",
    name: "Zoho Corporation",
    tagline: "Your Life's Work Powered by Our Life's Work",
    tier: "SaaS Product Unicorn",
    location: "Chennai, Tenkasi, Coimbatore, Austin",
    logoColor: "from-red-500 via-amber-500 to-emerald-500",
    badge: "Product SaaS",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    description: "Global cloud SaaS company with 55+ business applications, completely bootstrapped with proprietary technology stack.",
    gfgArchiveUrl: "https://www.geeksforgeeks.org/zoho-interview-experience-and-questions/",
    gfgTagUrl: "https://www.geeksforgeeks.org/tag/zoho/",
    openRoles: [
      {
        id: "zoho-sde",
        title: "Software Developer (Level 2/3)",
        department: "Zoho Desk / Zoho CRM Engineering",
        experience: "Freshers & 0 - 2 Years (Off-campus & On-campus)",
        workType: "Chennai (Estancia / Guduvanchery)",
        salaryRange: "₹8.5 LPA - ₹14 LPA",
        requiredSkills: ["C / C++ / Java", "Strong Logic Building", "Number Theory", "Matrix & Pointer Arithmetic"],
        description: "Build robust, high-performance web applications and backend systems from scratch without heavy third-party framework overhead.",
        assessment: {
          title: "Zoho Round 2 Advanced Programming Assessment",
          durationMinutes: 25,
          passThreshold: 70,
          format: "10 MCQs — C Pointers, Logic, Strings, SQL, OOP, Patterns, Recursion",
          questions: [
            {
              id: "zoho_q1", type: "mcq",
              question: "Zoho C Pointer Question: What is the output?\nint arr[] = {10, 20, 30, 40, 50};\nint *ptr = arr;\n*(ptr + 2) += 5;\nprintf(\"%d, %d\", *ptr, *(arr + 2));",
              options: ["15, 35","10, 35","10, 30","Compilation Error"],
              correctAnswer: 1, explanation: "*ptr is arr[0]=10. *(ptr+2) is arr[2]=30, adding 5 makes it 35. Output: 10, 35."
            },
            {
              id: "zoho_q2", type: "mcq",
              question: "Zoho String Expansion: Given 'a1b10', what is the decompressed output?",
              options: ["ab10","a + 10 b's = 'abbbbbbbbbb'","a10b10","abbbbbb"],
              correctAnswer: 1, explanation: "Each char is repeated by the following number. 'a1'→'a', 'b10'→10 b's."
            },
            {
              id: "zoho_q3", type: "mcq",
              question: "Zoho SQL: Why does 'WHERE UPPER(email) = ...' cause a full table scan on a B-Tree indexed column?",
              options: ["SQL doesn't allow uppercase queries","Function calls on columns bypass B-Tree indexes unless a function-based index is explicitly created","PostgreSQL disables indexes for varchar","Full scan is always faster"],
              correctAnswer: 1, explanation: "Applying UPPER() prevents the engine from using the standard index. A function-based index on UPPER(email) is needed."
            },
            {
              id: "zoho_q4", type: "mcq",
              question: "Zoho OOP: What is the output of this Java code?\nclass A { int x = 10; }\nclass B extends A { int x = 20; }\nA obj = new B();\nSystem.out.println(obj.x);",
              options: ["20","10","0","Compile Error"],
              correctAnswer: 1, explanation: "In Java, fields are NOT polymorphic. obj.x refers to the A class field, so output is 10."
            },
            {
              id: "zoho_q5", type: "mcq",
              question: "Zoho Recursion: What is the time complexity of computing Fibonacci(n) using naive recursion?",
              options: ["O(n)","O(2^n)","O(n log n)","O(n²)"],
              correctAnswer: 1, explanation: "Naive recursive Fibonacci has exponential time O(2^n) due to overlapping subproblems without memoization."
            },
            {
              id: "zoho_q6", type: "mcq",
              question: "Zoho Pattern: What does the following C code print?\nfor(int i=1; i<=4; i++) { for(int j=1; j<=i; j++) printf(\"*\"); printf(\"\\n\"); }",
              options: ["****\n***\n**\n*","*\n**\n***\n****","****\n****\n****\n****","Compilation Error"],
              correctAnswer: 1, explanation: "The inner loop prints j stars where j goes from 1 to i, creating a growing pyramid pattern."
            },
            {
              id: "zoho_q7", type: "mcq",
              question: "Zoho Logic: A number is passed to a function. The function returns true if the number is a palindrome. What is the correct approach without converting to string?",
              options: ["Compare digits using string conversion","Reverse the integer mathematically using modulo 10 and division, compare with original","Sort the digits and compare","Use recursion with character arrays"],
              correctAnswer: 1, explanation: "Extract digits via %10 and build the reversed number, then compare with original — no string conversion needed."
            },
            {
              id: "zoho_q8", type: "mcq",
              question: "Zoho Data Structures: What is the time complexity of inserting an element at the beginning of a singly linked list?",
              options: ["O(n)","O(1)","O(log n)","O(n²)"],
              correctAnswer: 1, explanation: "Inserting at the head of a linked list only requires updating the head pointer — O(1) regardless of size."
            },
            {
              id: "zoho_q9", type: "mcq",
              question: "Zoho SQL Joins: Which type of join returns rows from the LEFT table even if there is no match in the RIGHT table?",
              options: ["INNER JOIN","LEFT OUTER JOIN","CROSS JOIN","RIGHT INNER JOIN"],
              correctAnswer: 1, explanation: "LEFT JOIN returns all rows from the left table, with NULLs for columns from the right table when no match exists."
            },
            {
              id: "zoho_q10", type: "mcq",
              question: "Zoho C: What is the output of printf(\"%d\", sizeof('A')) in C (not C++)?",
              options: ["1","4","2","8"],
              correctAnswer: 1, explanation: "In C, character literals like 'A' are of type int, not char. So sizeof('A') returns sizeof(int) = 4 on most platforms."
            }
          ]
        },
        gfgRecommendations: [
          {
            title: "Zoho Previous Year Coding Questions & Solutions",
            url: "https://www.geeksforgeeks.org/zoho-interview-questions/",
            category: "Zoho Archives",
            level: "Must Solve"
          },
          {
            title: "C Puzzles & Pointer Arithmetic for Zoho Round 1",
            url: "https://www.geeksforgeeks.org/c-pointers-practice-questions/",
            category: "C Programming",
            level: "Intermediate"
          },
          {
            title: "Zoho String Manipulation & Pattern Printing Archive",
            url: "https://www.geeksforgeeks.org/print-string-specified-format/",
            category: "Pattern Logic",
            level: "Intermediate"
          }
        ]
      }
    ]
  },
  {
    id: "microsoft",
    name: "Microsoft",
    tagline: "Empower every person and every organization on the planet to achieve more",
    tier: "Tier-1 Tech Giant (MAANG)",
    location: "Hyderabad, Bengaluru, Noida, Redmond",
    logoColor: "from-cyan-500 via-blue-600 to-indigo-600",
    badge: "MAANG Tier-1",
    badgeBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    description: "Enterprise operating systems, Azure Cloud computing, AI Copilot, and developer tools (GitHub, VS Code).",
    gfgArchiveUrl: "https://www.geeksforgeeks.org/microsoft-interview-preparation/",
    gfgTagUrl: "https://www.geeksforgeeks.org/tag/microsoft/",
    openRoles: [
      {
        id: "ms-sde1",
        title: "Software Engineer (Azure Core & Cloud Platforms)",
        department: "Azure Cloud & AI Group",
        experience: "0 - 2 Years",
        workType: "Hyderabad / Bengaluru",
        salaryRange: "₹20 LPA - ₹32 LPA",
        requiredSkills: ["C# / C++ / Java", "Azure Services", "Data Structures", "REST APIs"],
        description: "Architect and implement distributed cloud infrastructure services managing global enterprise workloads.",
        assessment: {
          title: "Microsoft Codility Technical Assessment",
          durationMinutes: 25,
          passThreshold: 75,
          format: "10 MCQs — Azure, Trees/Graphs, OS, C#/.NET, OOP, System Design",
          questions: [
            {
              id: "ms_q1", type: "mcq",
              question: "In Azure Cosmos DB, which consistency level allows configuring maximum staleness lag (in time or updates)?",
              options: ["Strong Consistency","Bounded Staleness Consistency","Eventual Consistency","Session Consistency"],
              correctAnswer: 1, explanation: "Bounded Staleness lets developers configure the maximum lag window — giving a balance between strong consistency and availability."
            },
            {
              id: "ms_q2", type: "mcq",
              question: "What is the minimum number of stacks needed to implement a FIFO queue?",
              options: ["1 Stack","2 Stacks (push stack + pop stack)","3 Stacks","Stacks cannot simulate a queue"],
              correctAnswer: 1, explanation: "Two stacks are required: one for enqueue (push) and one for dequeue (reverse order pop)."
            },
            {
              id: "ms_q3", type: "mcq",
              question: "In C#, what is the difference between 'ref' and 'out' parameters?",
              options: ["No difference","'ref' requires the variable to be initialized before passing; 'out' requires the method to assign a value before returning","'out' is faster than 'ref'","'ref' only works with value types"],
              correctAnswer: 1, explanation: "'ref' passes already-initialized variable by reference. 'out' is for returning multiple values — the caller doesn't need to initialize it first."
            },
            {
              id: "ms_q4", type: "mcq",
              question: "What is the time complexity of finding the Lowest Common Ancestor (LCA) in a Binary Search Tree?",
              options: ["O(n)","O(h) where h is the height of the tree","O(log n) always","O(n²)"],
              correctAnswer: 1, explanation: "In a BST, LCA is found by traversing from root based on value comparisons — O(h) where h = log n for balanced, n for skewed."
            },
            {
              id: "ms_q5", type: "mcq",
              question: "In Microsoft's Azure Service Bus, what is the difference between queues and topics?",
              options: ["No functional difference","Queues support point-to-point messaging; Topics support publish-subscribe with multiple subscriber filters","Topics are slower than queues","Queues support multiple consumers, Topics only one"],
              correctAnswer: 1, explanation: "Topics + subscriptions enable fan-out pub-sub patterns; Queues are point-to-point FIFO channels."
            },
            {
              id: "ms_q6", type: "mcq",
              question: "What does the SOLID principle 'D' (Dependency Inversion) state?",
              options: ["Delete unused dependencies","High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces)","Dependencies should be injected via constructor","Duplicate code should be inverted into shared utilities"],
              correctAnswer: 1, explanation: "DIP mandates relying on abstractions, not concrete implementations — enabling loose coupling and testability."
            },
            {
              id: "ms_q7", type: "mcq",
              question: "Which graph traversal algorithm is best suited for finding the shortest path in an unweighted graph?",
              options: ["Depth First Search (DFS)","Breadth First Search (BFS)","Dijkstra's Algorithm","Bellman-Ford Algorithm"],
              correctAnswer: 1, explanation: "BFS explores nodes level by level, guaranteeing the shortest path in terms of edge count for unweighted graphs."
            },
            {
              id: "ms_q8", type: "mcq",
              question: "In Azure, what is the purpose of an 'Availability Zone'?",
              options: ["A geographic region grouping","Physically separate data centers within an Azure region to protect against datacenter-level failures","A virtual network subnet","A billing unit for resource groups"],
              correctAnswer: 1, explanation: "Availability Zones are distinct physical datacenters within a region, each with independent power/cooling/networking for fault isolation."
            },
            {
              id: "ms_q9", type: "mcq",
              question: "What is a deadlock in operating systems and how does the Banker's Algorithm prevent it?",
              options: ["A race condition; prevented by mutexes","A state where processes wait for resources held by each other; Banker's Algorithm prevents deadlock by only granting resources if a safe state exists","A memory leak; prevented by garbage collection","An infinite loop; prevented by thread timeouts"],
              correctAnswer: 1, explanation: "Banker's Algorithm simulates resource allocation and only approves requests that keep the system in a safe (deadlock-free) state."
            },
            {
              id: "ms_q10", type: "mcq",
              question: "What is the output of this C# code?\n\nint x = 5;\nConsole.WriteLine(x++ + ++x);",
              options: ["11","12","10","13"],
              correctAnswer: 1, explanation: "x++ returns 5 (then x=6), ++x increments to 7 first. 5 + 7 = 12."
            }
          ]
        },
        gfgRecommendations: [
          {
            title: "Top 50 Microsoft Interview Questions",
            url: "https://www.geeksforgeeks.org/microsoft-interview-questions/",
            category: "Coding Sheet",
            level: "Intermediate - Hard"
          },
          {
            title: "Binary Tree & BST Interview Problems for Microsoft",
            url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
            category: "Trees & Graphs",
            level: "Intermediate"
          }
        ]
      }
    ]
  },
  {
    id: "tcs",
    name: "Tata Consultancy Services (TCS)",
    tagline: "Building on belief — Global leader in IT services, consulting & business solutions",
    tier: "Tier-1 Global IT Services",
    location: "Chennai, Pune, Hyderabad, Bengaluru, Mumbai, Delhi",
    logoColor: "from-blue-700 to-indigo-900",
    badge: "Mass & Digital Recruiter",
    badgeBg: "bg-blue-600/15 text-blue-400 border-blue-600/30",
    description: "India's largest multinational technology services provider, hiring thousands of campus engineers through TCS NQT & TCS Digital.",
    gfgArchiveUrl: "https://www.geeksforgeeks.org/tcs-recruitment-process/",
    gfgTagUrl: "https://www.geeksforgeeks.org/tag/tcs/",
    openRoles: [
      {
        id: "tcs-digital",
        title: "TCS Digital - Elite Software Developer",
        department: "NextGen Digital Enterprise Technologies",
        experience: "Freshers (2025 / 2026 Batch)",
        workType: "Pan India (Chennai / Hyderabad / Pune)",
        salaryRange: "₹7.5 LPA - ₹9 LPA",
        requiredSkills: ["Java / Python", "SQL & Relational DBs", "Advanced Aptitude", "Algorithms"],
        description: "Work on high-priority digital transformation projects in Cloud, AI, Cybersecurity, and IoT.",
        assessment: {
          title: "TCS Digital Advanced Technical NQT",
          durationMinutes: 25,
          passThreshold: 65,
          format: "10 MCQs — SQL, Java, Aptitude, OOP, Algorithms, Cloud Basics",
          questions: [
            {
              id: "tcs_q1", type: "mcq",
              question: "TCS SQL: Which query returns the 2nd highest distinct salary without LIMIT/TOP?\n(Table: EMPLOYEES — EMP_ID, SALARY, DEPT_ID)",
              options: ["SELECT MAX(SALARY) FROM EMPLOYEES WHERE SALARY < (SELECT MAX(SALARY) FROM EMPLOYEES)","SELECT SALARY FROM EMPLOYEES ORDER BY SALARY DESC OFFSET 2","SELECT MIN(SALARY) FROM EMPLOYEES GROUP BY DEPT_ID","SELECT AVG(SALARY) FROM EMPLOYEES"],
              correctAnswer: 0, explanation: "A nested MAX with a WHERE clause excluding the maximum is the standard ANSI SQL approach for 2nd highest salary."
            },
            {
              id: "tcs_q2", type: "mcq",
              question: "In Java, what happens when two objects have the same hashCode() in a HashMap?",
              options: ["Second overwrites first","Hash collision — both stored in same bucket (linked list, or balanced tree if > 8 entries in Java 8+)","JVM throws DuplicateKeyException","HashMap size reduces"],
              correctAnswer: 1, explanation: "Collision is resolved by chaining. Java 8+ converts chains >8 into Red-Black Trees for O(log n) lookup."
            },
            {
              id: "tcs_q3", type: "mcq",
              question: "TCS NQT Aptitude: A train 120m long passes a pole in 10 seconds. What is the speed of the train in km/h?",
              options: ["36 km/h","43.2 km/h","72 km/h","54 km/h"],
              correctAnswer: 1, explanation: "Speed = 120/10 = 12 m/s. Convert: 12 × 3.6 = 43.2 km/h."
            },
            {
              id: "tcs_q4", type: "mcq",
              question: "TCS Python: What is the output of print(type(1/2)) in Python 3?",
              options: ["<class 'int'>","<class 'float'>","<class 'fraction'>","TypeError"],
              correctAnswer: 1, explanation: "In Python 3, the / operator always performs true division and returns float. Use // for integer division."
            },
            {
              id: "tcs_q5", type: "mcq",
              question: "TCS Cloud: In TCS's iON cloud or general cloud concepts, what does 'elasticity' mean?",
              options: ["Permanent scaling up of servers","Automatically scaling resources up or down based on real-time demand","Data backup across regions","High availability with zero downtime"],
              correctAnswer: 1, explanation: "Elasticity means dynamic resource scaling to match current demand — not permanent over-provisioning."
            },
            {
              id: "tcs_q6", type: "mcq",
              question: "TCS OOP: Which OOP principle allows a child class to provide a specific implementation of a method already defined in its parent class?",
              options: ["Encapsulation","Method Overriding (Runtime Polymorphism)","Method Overloading","Abstraction"],
              correctAnswer: 1, explanation: "Overriding allows a subclass to replace the parent's method behavior — this is the basis of runtime polymorphism."
            },
            {
              id: "tcs_q7", type: "mcq",
              question: "TCS Algorithms: What is the best-case time complexity of Bubble Sort?",
              options: ["O(n²)","O(n) — when the array is already sorted with early termination flag","O(log n)","O(n log n)"],
              correctAnswer: 1, explanation: "With an optimized Bubble Sort that uses a 'swapped' flag, the algorithm exits after one pass through a sorted array — O(n) best case."
            },
            {
              id: "tcs_q8", type: "mcq",
              question: "TCS SQL: What is the difference between WHERE and HAVING clauses?",
              options: ["No difference","WHERE filters rows before grouping; HAVING filters groups after GROUP BY","HAVING works on individual rows","WHERE is used only with JOINs"],
              correctAnswer: 1, explanation: "WHERE applies before aggregation; HAVING applies after GROUP BY on aggregated results like COUNT, SUM, AVG."
            },
            {
              id: "tcs_q9", type: "mcq",
              question: "TCS Java: What is the output of this code?\n\nString s1 = \"TCS\";\nString s2 = \"TCS\";\nSystem.out.println(s1 == s2);",
              options: ["false","true","null","Compilation Error"],
              correctAnswer: 1, explanation: "String literals in Java are stored in the String Pool. s1 and s2 both point to the same pool object, so == returns true."
            },
            {
              id: "tcs_q10", type: "mcq",
              question: "TCS Data Structures: Which tree data structure ensures O(log n) worst-case lookup, insertion, and deletion?",
              options: ["Binary Tree","AVL Tree (Self-Balancing BST)","General Tree","N-ary Tree"],
              correctAnswer: 1, explanation: "AVL Trees maintain height balance after every insertion/deletion by rotating nodes, guaranteeing O(log n) for all operations."
            }
          ]
        },
        gfgRecommendations: [
          {
            title: "TCS Digital Previous Year Coding Questions & Answers",
            url: "https://www.geeksforgeeks.org/tcs-digital-coding-questions/",
            category: "TCS Digital",
            level: "Intermediate"
          },
          {
            title: "Top 50 SQL Query Questions for Technical Rounds",
            url: "https://www.geeksforgeeks.org/sql-interview-questions/",
            category: "Databases",
            level: "Important"
          }
        ]
      }
    ]
  },
  {
    id: "infosys",
    name: "Infosys",
    tagline: "Navigate your next — Digital agility & human-centric tech consulting",
    tier: "Tier-1 Global IT Services",
    location: "Bengaluru, Mysore, Pune, Chennai, Hyderabad",
    logoColor: "from-blue-600 to-sky-400",
    badge: "Specialist Recruiter",
    badgeBg: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    description: "Renowned worldwide for its legendary Mysore Global Education Center, hiring for Specialist Programmer and Systems Engineer roles.",
    gfgArchiveUrl: "https://www.geeksforgeeks.org/infosys-interview-preparation/",
    gfgTagUrl: "https://www.geeksforgeeks.org/tag/infosys/",
    openRoles: [
      {
        id: "infy-sp",
        title: "Specialist Programmer (Power Programmer)",
        department: "Advanced Technology Group",
        experience: "Freshers (Campus & HackWithInfy)",
        workType: "Bengaluru / Pune",
        salaryRange: "₹9.5 LPA - ₹11 LPA",
        requiredSkills: ["Full Stack / Python / Java", "Greedy & Dynamic Programming", "DBMS", "REST"],
        description: "High-level programming role building complex cloud solutions, open-source architectures, and digital banking platforms.",
        assessment: {
          title: "Infosys HackWithInfy Specialist Coding Assessment",
          durationMinutes: 25,
          passThreshold: 70,
          format: "10 MCQs — Greedy Algorithms, Dynamic Programming, Graph Theory, Core CS & Concurrency",
          questions: [
            {
              id: "infy_q1",
              type: "mcq",
              question: "Given an activity selection problem where each activity has a start and finish time, which greedy criterion yields the maximum number of mutually compatible activities?",
              options: [
                "Select activity with earliest start time",
                "Select activity with earliest finish time",
                "Select activity with shortest duration",
                "Select activity with maximum conflicts"
              ],
              correctAnswer: 1,
              explanation: "Sorting activities by earliest finish time leaves the maximum possible remaining time for subsequent activities, proving mathematically optimal."
            },
            {
              id: "infy_q2",
              type: "mcq",
              question: "What is the key difference in algorithmic strategy and complexity between the 0/1 Knapsack problem and the Fractional Knapsack problem?",
              options: [
                "0/1 Knapsack is solved in O(N log N) using Greedy; Fractional Knapsack requires O(N*W) Dynamic Programming",
                "0/1 Knapsack requires Dynamic Programming with O(N*W) pseudo-polynomial time; Fractional Knapsack is solved greedily by sorting value/weight ratios in O(N log N)",
                "Both problems can be solved in O(N) using Depth-First Search with backtracking",
                "Fractional Knapsack is NP-Complete, whereas 0/1 Knapsack is polynomial"
              ],
              correctAnswer: 1,
              explanation: "Fractional Knapsack exhibits the greedy choice property (pick highest value-to-weight ratio items). 0/1 Knapsack items cannot be divided, requiring DP state transitions dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]])."
            },
            {
              id: "infy_q3",
              type: "mcq",
              question: "What is the optimal time complexity to find the length of the Longest Increasing Subsequence (LIS) in an array of size N using Patience Sorting / Binary Search?",
              options: [
                "O(N^2)",
                "O(N log N)",
                "O(N log^2 N)",
                "O(2^N)"
              ],
              correctAnswer: 1,
              explanation: "Maintaining an active tails array and performing binary search (std::lower_bound / Arrays.binarySearch) for each element achieves optimal O(N log N) time."
            },
            {
              id: "infy_q4",
              type: "mcq",
              question: "When running Dijkstra's Single Source Shortest Path algorithm on a directed weighted graph with V vertices and E edges using a Min-Heap / Priority Queue, what is the running time?",
              options: [
                "O(V^2)",
                "O((V + E) log V)",
                "O(V * E)",
                "O(E log E + V)"
              ],
              correctAnswer: 1,
              explanation: "Extract-min takes O(log V) for each of the V vertices, and edge relaxation updates take O(log V) for each of the E edges, totaling O((V + E) log V)."
            },
            {
              id: "infy_q5",
              type: "mcq",
              question: "Which data structure provides O(log N) point updates and O(log N) range sum / range minimum queries over an array of size N?",
              options: [
                "Binary Search Tree without balancing",
                "Segment Tree or Binary Indexed Tree (Fenwick Tree)",
                "Prefix Sum Array",
                "Skip List"
              ],
              correctAnswer: 1,
              explanation: "Segment Trees and Fenwick Trees decompose ranges hierarchically into powers of two, enabling both point updates and range queries in logarithmic time."
            },
            {
              id: "infy_q6",
              type: "mcq",
              question: "In Java multithreaded systems, what is the primary advantage of ReentrantLock over the intrinsic synchronized keyword?",
              options: [
                "ReentrantLock consumes zero memory on the thread stack",
                "ReentrantLock provides timed lock acquisition (tryLock with timeout), interruptible lock waits, and fairness policies",
                "synchronized locks can cause deadlocks while ReentrantLock guarantees deadlock prevention",
                "ReentrantLock automatically synchronizes all member variables of the calling class"
              ],
              correctAnswer: 1,
              explanation: "java.util.concurrent.locks.ReentrantLock provides advanced capabilities like tryLock(timeout), lockInterruptibly(), fair queueing, and multiple condition variables."
            },
            {
              id: "infy_q7",
              type: "mcq",
              question: "Topological Sorting of a graph using Kahn's algorithm (indegree queue) is strictly valid if and only if the graph is:",
              options: [
                "An Undirected Connected Graph",
                "A Directed Acyclic Graph (DAG)",
                "A Complete Bipartite Graph",
                "A Strongly Connected Component"
              ],
              correctAnswer: 1,
              explanation: "Topological ordering orders vertices such that for every directed edge u -> v, u comes before v. If a cycle exists, indegrees can never reach zero, making ordering impossible."
            },
            {
              id: "infy_q8",
              type: "mcq",
              question: "In relational database engineering (PostgreSQL / MySQL), what occurs during a query join if the foreign key column lacks a B-Tree index on a table with 10 million rows?",
              options: [
                "The database automatically creates a temporary hash index that persists permanently",
                "The query planner falls back to an expensive sequential full-table scan (O(N)), resulting in severe disk I/O bottleneck",
                "The database throws a syntax error rejecting unindexed foreign keys",
                "The query runs in constant O(1) time using buffer cache memory"
              ],
              correctAnswer: 1,
              explanation: "Without an index on the join predicate, the query engine cannot perform index seeks and must sequentially scan every page of the table."
            },
            {
              id: "infy_q9",
              type: "mcq",
              question: "In a Trie (Prefix Tree) containing 1,000,000 words, what is the worst-case time complexity to search if a word of length L exists?",
              options: [
                "O(L)",
                "O(log 1,000,000)",
                "O(L * log 1,000,000)",
                "O(26^L)"
              ],
              correctAnswer: 0,
              explanation: "Trie lookup traverses exactly one child pointer per character of the word, taking O(L) time completely independent of how many millions of words are stored."
            },
            {
              id: "infy_q10",
              type: "mcq",
              question: "Which Garbage Collector in modern Java (JDK 17+) is designed for multi-gigabyte heaps to maintain pause times under 10 milliseconds using concurrent marking and region evacuation?",
              options: [
                "Serial GC",
                "Parallel Old GC (Throughput Collector)",
                "ZGC (Z Garbage Collector) and G1 GC",
                "Reference Counting Collector"
              ],
              correctAnswer: 2,
              explanation: "ZGC uses colored pointers and load barriers to perform nearly all garbage collection phases concurrently with application threads, keeping STW pauses sub-millisecond."
            }
          ]
        },
        gfgRecommendations: [
          {
            title: "Infosys Specialist Programmer Coding Sheet",
            url: "https://www.geeksforgeeks.org/infosys-interview-questions/",
            category: "Infosys Archives",
            level: "Intermediate - Hard"
          }
        ]
      }
    ]
  }
];

// Comprehensive 4-Phase Placement Roadmap based on Company & Role
export function getCompanyRoadmap(companyId, roleId) {
  if (companyId === "zoho") {
    return [
      {
        phase: "Phase 1: C/C++ Pointers & Memory Mechanics",
        weeks: "Week 1 - 2",
        focus: "Pointer arithmetic, dynamic memory allocation (malloc/calloc/free), struct pointers, and bitwise operations.",
        topics: [
          "Pointer to pointer (**ptr) and function pointers",
          "Pass by value vs Pass by reference in C/C++",
          "Memory leak detection and dangling pointer prevention",
          "Bitwise operations (XOR swap, power of 2 check, bit masking)"
        ],
        milestone: "Able to trace 100% of complex pointer output prediction MCQs without a compiler."
      },
      {
        phase: "Phase 2: Recursion & Mathematical Pattern Coding",
        weeks: "Week 3 - 4",
        focus: "Zoho Level 2 Coding Round: String permutations, matrix rotations, pattern printing, and recursion puzzles.",
        topics: [
          "String anagrams, substring permutations, and palindrome partitioning",
          "Matrix spiral printing, 90-degree in-place rotation",
          "Backtracking: N-Queens, Sudoku solver, Word Search in grid",
          "Custom numeric algorithms without built-in library functions"
        ],
        milestone: "Solve 20+ Zoho Level 2 coding problems from previous placement drives within 45 mins each."
      },
      {
        phase: "Phase 3: Low-Level System Design (LLD / Object Oriented Design)",
        weeks: "Week 5 - 6",
        focus: "Zoho Level 3 Round: Design complete console applications with clean classes and modular OOP architecture.",
        topics: [
          "Railway Ticket Reservation System (Waiting List, RAC, Berth Allocation)",
          "Call Taxi Booking Application (Distance calculation, Nearest driver dispatch)",
          "Snake and Ladder / Chess Game OOP model",
          "Inventory Management System with persistent text file / in-memory storage"
        ],
        milestone: "Implement a full working LLD application in Java/C++ with menus and edge-case handling."
      },
      {
        phase: "Phase 4: Technical HR & Speed Coding Drills",
        weeks: "Week 7 - 8",
        focus: "Final Technical Interview with Zoho Architects and Engineering Leads.",
        topics: [
          "Live code explanation and optimization to O(1) space",
          "Deep dive into final year college projects and system trade-offs",
          "Core CS fundamentals: Operating Systems, Process vs Thread, Database Indexing",
          "Culture fit and dedication to product-first bootstrapped engineering"
        ],
        milestone: "Pass 3 complete timed mock assessments with zero proctoring violations."
      }
    ];
  }

  if (companyId === "google" || companyId === "microsoft" || companyId === "amazon") {
    return [
      {
        phase: "Phase 1: Advanced Data Structures & Time Complexity",
        weeks: "Week 1 - 2",
        focus: "Deep algorithmic intuition, amortized analysis, Segment Trees, Trie, Heaps, and Disjoint Set Union (DSU).",
        topics: [
          "Segment Trees with Lazy Propagation & Fenwick Trees",
          "Prefix Trie for autocomplete and Bitwise XOR maximums",
          "Priority Queues & Custom Comparators in C++ STL / Java",
          "Union-Find with Path Compression and Rank Heuristic"
        ],
        milestone: "Solve 30 LeetCode Mediums covering foundational tree and graph structures."
      },
      {
        phase: "Phase 2: Hard Dynamic Programming & Graph Algorithms",
        weeks: "Week 3 - 4",
        focus: "Multi-dimensional DP, Bitmask DP, Topological Sort, Dijkstra, and Network Flows.",
        topics: [
          "Dynamic Programming on Trees and DAG Longest Paths",
          "Shortest Path algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall)",
          "Strongly Connected Components (Tarjan's & Kosaraju's Algorithm)",
          "Sliding Window Maximum & Monotonic Stack / Queue patterns"
        ],
        milestone: "Achieve 80%+ success rate on company-tagged LeetCode Hard and Medium problems."
      },
      {
        phase: "Phase 3: High-Level System Design & Distributed Architecture",
        weeks: "Week 5 - 6",
        focus: "Scalability, Caching (Redis), Load Balancing, Database Sharding, CAP Theorem, and Microservices.",
        topics: [
          "Design TinyURL / URL Shortener with high availability",
          "Design Distributed Message Broker (Kafka / SQS architecture)",
          "Database scaling: Master-Slave replication, Consistent Hashing",
          "Concurrency control: Optimistic vs Pessimistic Locking & TrueTime API"
        ],
        milestone: "Draw end-to-end architecture diagrams and handle back-of-the-envelope capacity estimations."
      },
      {
        phase: "Phase 4: Mock OA & Leadership / Behavioral Rounds",
        weeks: "Week 7 - 8",
        focus: "Amazon Leadership Principles / Google Googliness & Live Coding Interviews.",
        topics: [
          "STAR method responses (Situation, Task, Action, Result)",
          "Mock timed 70-minute coding rounds under webcam/mic proctoring",
          "Clear communication: Thinking out loud during problem solving",
          "System trade-off justifications and edge case discovery"
        ],
        milestone: "Complete 5 mock interviews with peers on SkillSwap and achieve top tier score."
      }
    ];
  }

  // Default / TCS / Infosys
  return [
    {
      phase: "Phase 1: Core Programming Languages & OOP Mastery",
      weeks: "Week 1 - 2",
      focus: "Master Java / Python / C++, Object-Oriented Programming, and Core CS Fundamentals.",
      topics: [
        "Java Collections Framework (ArrayList, HashMap, HashSet, PriorityQueue)",
        "Polymorphism, Inheritance, Encapsulation, and Abstract Classes",
        "Exception handling and Memory Management (Garbage Collection)",
        "Basic recursion, time complexity (Big-O notation)"
      ],
      milestone: "Complete 50 foundational coding exercises without compiler assistance."
    },
    {
      phase: "Phase 2: Data Structures & Advanced Aptitude",
      weeks: "Week 3 - 4",
      focus: "TCS NQT / Infosys HackWithInfy algorithmic puzzles and numerical aptitude.",
      topics: [
        "Array manipulations, matrix operations, and Two-Pointer technique",
        "String processing, regular expressions, and frequency counts",
        "Binary Search, Quick Sort, Merge Sort implementations",
        "Aptitude: Permutations, Probability, Work & Time, Speed & Distance"
      ],
      milestone: "Score 85%+ on TCS Digital / Infosys Specialist practice sheets."
    },
    {
      phase: "Phase 3: Database (SQL) & Full Stack Web Concepts",
      weeks: "Week 5 - 6",
      focus: "Relational database queries, indexing, and REST API development.",
      topics: [
        "SQL Joins (Inner, Left, Right, Full Outer) & Group By aggregations",
        "Subqueries, Window Functions (RANK, DENSE_RANK, ROW_NUMBER)",
        "Database Indexing (B-Trees) and ACID Transactions",
        "REST API conventions, HTTP methods, and status codes"
      ],
      milestone: "Write complex 3-table join queries and understand database normalization (1NF to BCNF)."
    },
    {
      phase: "Phase 4: Live Mock Assessments & HR rounds",
      weeks: "Week 7 - 8",
      focus: "TCS Digital / Infosys Power Programmer technical interview prep.",
      topics: [
        "Live coding of standard algorithms in under 30 minutes",
        "Explanation of academic mini-projects and resume contributions",
        "Managerial & HR situational behavioral questions",
        "Agile software development methodology and Git collaboration"
      ],
      milestone: "Pass corporate online proctored challenge with verified clean proctor log."
    }
  ];
}

// Multi-Platform Learning Hub (YouTube, LeetCode, Coursera, Roadmap.sh, GeeksforGeeks, GitHub)
export function getMultiPlatformResources(companyId, roleId) {
  const commonResources = [
    {
      id: "res_yt_striver",
      title: "Striver's A2Z DSA Complete Course & SDE Sheet",
      platform: "YouTube",
      creator: "Take U Forward (Striver)",
      type: "Video Course",
      badge: "100% Free",
      level: "Beginner to Advanced",
      rating: "4.9 ★ (1.5M+ Learners)",
      url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
      description: "Comprehensive 45-hour video tutorial series covering data structures, dynamic programming, graphs, and greedy algorithms with step-by-step whiteboard explanations.",
      color: "border-red-500/30 bg-red-500/10 text-red-400"
    },
    {
      id: "res_lc_neetcode",
      title: "NeetCode 150 - Company Coding Patterns & Solutions",
      platform: "LeetCode",
      creator: "NeetCode Community",
      type: "Interactive Problem Set",
      badge: "Industry Standard",
      level: "Intermediate - Hard",
      rating: "4.9 ★ (800k+ Solvers)",
      url: "https://neetcode.io/practice",
      description: "150 handpicked coding problems categorized by pattern (Sliding Window, Two Pointers, Backtracking, Graphs) with free video explanations.",
      color: "border-amber-500/30 bg-amber-500/10 text-amber-400"
    },
    {
      id: "res_coursera_algo",
      title: "Algorithms Specialization by Stanford University",
      platform: "Coursera",
      creator: "Prof. Tim Roughgarden (Stanford)",
      type: "University Course",
      badge: "Accredited Certificate",
      level: "Intermediate",
      rating: "4.8 ★ (350k+ Enrolled)",
      url: "https://www.coursera.org/specializations/algorithms",
      description: "Rigorous academic foundation in divide-and-conquer, randomized algorithms, graph search, shortest paths, and NP-complete problems.",
      color: "border-blue-500/30 bg-blue-500/10 text-blue-400"
    },
    {
      id: "res_roadmap_cs",
      title: "Computer Science & System Architecture Visual Roadmap",
      platform: "Roadmap.sh",
      creator: "Roadmap Community",
      type: "Interactive Roadmap",
      badge: "Visual Guide",
      level: "All Levels",
      rating: "5.0 ★ (250k+ Stars)",
      url: "https://roadmap.sh/computer-science",
      description: "Interactive visual decision tree covering data structures, memory management, operating systems, networking, and distributed computing.",
      color: "border-teal-500/30 bg-teal-500/10 text-teal-400"
    },
    {
      id: "res_github_hld",
      title: "The System Design Primer & Scalability Cheatsheets",
      platform: "GitHub",
      creator: "Donne Martin",
      type: "Open Source Guide",
      badge: "265k+ Stars",
      level: "Intermediate - Advanced",
      rating: "5.0 ★ Top GitHub Repo",
      url: "https://github.com/donnemartin/system-design-primer",
      description: "The gold-standard open source guide to learning how to design large-scale systems, load balancers, caching layers, and microservices.",
      color: "border-purple-500/30 bg-purple-500/10 text-purple-400"
    },
    {
      id: "res_yt_gaurav",
      title: "System Design & Microservices Architecture Series",
      platform: "YouTube",
      creator: "Gaurav Sen",
      type: "Video Series",
      badge: "Free Playlist",
      level: "Intermediate",
      rating: "4.9 ★ (700k+ Engineers)",
      url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoC",
      description: "Visual architectural walkthroughs of WhatsApp, Netflix, Distributed Caches, and Message Queues.",
      color: "border-red-500/30 bg-red-500/10 text-red-400"
    },
    {
      id: "res_gfg_company",
      title: "GeeksforGeeks Company Specific Placement Archive",
      platform: "GeeksforGeeks",
      creator: "GFG Technical Authors",
      type: "Interview Archive",
      badge: "Real Interview Qs",
      level: "Targeted",
      rating: "4.7 ★",
      url: "https://www.geeksforgeeks.org/company-preparation/",
      description: "Curated archive of recently asked interview experiences, online assessment coding problems, and technical round questions.",
      color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    },
    {
      id: "res_lc_sql",
      title: "LeetCode SQL 50 Study Plan",
      platform: "LeetCode",
      creator: "LeetCode Team",
      type: "Interactive Problem Set",
      badge: "Database Mastery",
      level: "Easy to Hard",
      rating: "4.8 ★",
      url: "https://leetcode.com/studyplan/top-sql-50/",
      description: "The 50 most essential SQL queries covering joins, window functions, and subqueries tested by technical interviewers.",
      color: "border-amber-500/30 bg-amber-500/10 text-amber-400"
    }
  ];

  // Company-specific additions
  if (companyId === "zoho") {
    return [
      {
        id: "res_zoho_c_pointers",
        title: "C Pointers & Advanced Memory Manipulation Deep Dive",
        platform: "YouTube",
        creator: "Jenny's Lectures / Abdul Bari",
        type: "Video Course",
        badge: "Zoho Essential",
        level: "Beginner - Intermediate",
        rating: "4.9 ★ (1.8M Learners)",
        url: "https://www.youtube.com/playlist?list=PLdo5W4Nhv31a8UcMN9-35ghv8qyFWD9_S",
        description: "Master C pointers, double pointers, dynamic memory allocation, and bitwise tricks tested rigorously in Zoho Round 1 & 2.",
        color: "border-red-500/30 bg-red-500/10 text-red-400"
      },
      {
        id: "res_zoho_gfg_level2",
        title: "Zoho Level 2 & 3 Previous Years Coding Questions & Solutions",
        platform: "GeeksforGeeks",
        creator: "GFG Zoho Archive",
        type: "Coding Archive",
        badge: "Direct Placement Sheet",
        level: "Intermediate",
        rating: "4.8 ★",
        url: "https://www.geeksforgeeks.org/zoho-interview-experience-and-questions/",
        description: "Dedicated question bank of Zoho Level 2 coding questions (string permutations, matrix spirals) and Level 3 LLD system applications.",
        color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      },
      {
        id: "res_zoho_github_lld",
        title: "Zoho Level 3 Low Level Design (LLD) Problem Implementations",
        platform: "GitHub",
        creator: "Community Contributors",
        type: "Open Source Code",
        badge: "Ready-to-run Code",
        level: "Intermediate",
        rating: "4.9 ★",
        url: "https://github.com/topics/zoho-interview-questions",
        description: "Complete Java/C++ implementations of Railway Reservation, Call Taxi Booking, and Toll Payment systems asked in Zoho Level 3 interviews.",
        color: "border-purple-500/30 bg-purple-500/10 text-purple-400"
      },
      ...commonResources
    ];
  }

  return commonResources;
}
